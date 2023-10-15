import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { JwtToken } from "../schemas/jwt-token.js";
import type { UpdateArticleBody } from "../schemas/update-article-body.js";
import type { UpdateArticleParams } from "../schemas/update-article-params.js";

export async function updateArticle(
  db: Kysely<DB>,
  req: { params: UpdateArticleParams; body: UpdateArticleBody; jwt: JwtToken },
) {
  const result = await db
    .updateTable("articles")
    .set({
      title: req.body.article.title,
      description: req.body.article.description,
      body: req.body.article.body,
    })
    .where((eb) =>
      eb.and({
        slug: req.params.slug,
        author_id: eb
          .selectFrom("users")
          .select("users.id")
          .where("users.username", "=", req.jwt.user.username),
      }),
    )
    .executeTakeFirst();

  return !!result.numUpdatedRows;
}
