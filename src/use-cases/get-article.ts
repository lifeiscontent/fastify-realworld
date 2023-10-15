import type { Kysely } from "kysely";
import { sql } from "kysely";
import type { DB } from "kysely-codegen";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { favorited, tagList } from "../kysely/articles.js";
import { following } from "../kysely/users.js";
import type { Article } from "../schemas/article.js";
import type { GetArticleParams } from "../schemas/get-article-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";
import { toISOString } from "../utils/kysely.js";

export async function getArticle(
  db: Kysely<DB>,
  req: { params: GetArticleParams; jwt?: JwtToken },
): Promise<Article | undefined> {
  const qb = db
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
            .whereRef("user_favorite_articles.article_id", "=", "articles.id"),
          sql<string>`0`,
        )
        .as("favoritesCount"),
      favorited(eb, req.jwt?.user.username).as("favorited"),
    ])
    .where("slug", "=", req.params.slug);

  return qb.executeTakeFirst();
}
