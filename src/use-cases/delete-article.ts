import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { DeleteArticleParams } from "../schemas/delete-article-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";

export async function deleteArticle(
  db: Kysely<DB>,
  req: { params: DeleteArticleParams; jwt: JwtToken },
) {
  const result = await db
    .deleteFrom("articles")
    .where((eb) =>
      eb.and([
        eb("articles.slug", "=", req.params.slug),
        eb(
          "articles.author_id",
          "=",
          eb
            .selectFrom("users")
            .select("users.id")
            .where("users.username", "=", req.jwt.user.username),
        ),
      ]),
    )
    .executeTakeFirst();

  return !!result.numDeletedRows;
}
