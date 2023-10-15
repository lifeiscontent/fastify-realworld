import type { Kysely } from "kysely";
import { DeduplicateJoinsPlugin, sql } from "kysely";
import type { DB } from "kysely-codegen";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { favorited, tagList } from "../kysely/articles.js";
import { following } from "../kysely/users.js";
import type { Article } from "../schemas/article.js";
import type { GetArticlesQuerystring } from "../schemas/get-articles-querystring.js";
import type { JwtToken } from "../schemas/jwt-token.js";
import { toISOString } from "../utils/kysely.js";

export async function getArticles(
  db: Kysely<DB>,
  req: { query?: GetArticlesQuerystring; jwt?: JwtToken } = {},
): Promise<{ articlesCount: string; articles: Article[] }> {
  const articlesQb = db
    .withPlugin(new DeduplicateJoinsPlugin())
    .selectFrom("articles")
    .select((eb) => [
      "articles.slug",
      "articles.body",
      toISOString(eb, "articles.created_at").as("createdAt"),
      "articles.description",
      "articles.title",
      toISOString(eb, "articles.updated_at").as("updatedAt"),
      jsonObjectFrom(
        eb
          .selectFrom("users")
          .select((eb) => [
            "users.bio",
            "users.image",
            "users.username",
            following(eb, req.jwt?.user.username).as("following"),
          ])
          .whereRef("users.id", "=", "articles.author_id"),
      )
        .$castTo<Article["author"]>()
        .as("author"),
      tagList(eb).as("tagList"),
      eb.fn
        .coalesce(
          eb
            .selectFrom("user_favorite_articles")
            .select((eb) => eb.fn.countAll<string>().as("favoritesCount"))
            .whereRef("article_id", "=", "articles.id"),

          sql<string>`0`,
        )
        .as("favoritesCount"),
      favorited(eb, req.jwt?.user.username).as("favorited"),
    ])
    .$if(req.query?.tag !== undefined, (qb) =>
      qb
        .innerJoin("article_tags", "article_tags.article_id", "articles.id")
        .innerJoin("tags", "tags.id", "article_tags.tag_id")
        .where("tags.name", "=", req.query!.tag!),
    )
    .$if(req.query?.author !== undefined, (qb) =>
      qb.where((web) =>
        web(
          "articles.author_id",
          "=",
          web
            .selectFrom("users")
            .select("users.id")
            .where("users.username", "=", req.query!.author!),
        ),
      ),
    )
    .$if(req.query?.favorited !== undefined, (qb) =>
      qb.where((web) =>
        web(
          "articles.id",
          "in",
          web
            .selectFrom("user_favorite_articles")
            .select("user_favorite_articles.article_id")
            .where((web) =>
              web(
                "user_favorite_articles.user_id",
                "=",
                web
                  .selectFrom("users")
                  .select("users.id")
                  .where("users.username", "=", req.query!.favorited!),
              ),
            ),
        ),
      ),
    );

  const { articlesCount } = await articlesQb
    .clearSelect()
    .select((eb) => eb.fn.countAll<string>().as("articlesCount"))
    .executeTakeFirstOrThrow();

  const articles = await articlesQb
    .limit(req.query?.limit ?? 10)
    .offset(req.query?.offset ?? 0)
    .execute();

  return {
    articles,
    articlesCount,
  };
}
