import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import slugify from "slugify";
import type { CreateArticleBody } from "../schemas/create-article-body.js";
import type { JwtToken } from "../schemas/jwt-token.js";
import { getUserIdByJwt } from "./get-user-id-by-username.js";

export async function createArticle(
  db: Kysely<DB>,
  req: { body: CreateArticleBody; jwt: JwtToken },
) {
  const userId = await getUserIdByJwt(db, req);
  const slug = slugify(`${req.body.article.title}-${userId}`);
  const result = await db.transaction().execute(async (trx) => {
    const article = await trx
      .insertInto("articles")
      .values({
        author_id: db
          .selectFrom("users")
          .select("users.id")
          .where("users.username", "=", req.jwt.user.username),
        body: req.body.article.body,
        description: req.body.article.description,
        slug,
        title: req.body.article.title,
      })
      .returning(["articles.slug"])
      .executeTakeFirstOrThrow();

    if (!req.body.article.tagList.length) return article;

    await trx
      .insertInto("tags")
      .values(req.body.article.tagList.map((tag) => ({ name: tag })))
      .onConflict((cb) => cb.doNothing())
      .execute();

    const tags = await trx
      .selectFrom("tags")
      .select("tags.id")
      .where("name", "in", req.body.article.tagList)
      .execute();

    await trx
      .insertInto("article_tags")
      .values((eb) =>
        tags.map((tag) => ({
          article_id: eb
            .selectFrom("articles")
            .select("articles.id")
            .where("articles.slug", "=", article.slug),
          tag_id: tag.id,
        })),
      )
      .execute();

    return article;
  });

  return result;
}
