import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { DeleteArticleCommentParams } from "../schemas/delete-article-comment-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";

export async function deleteArticleComment(
  db: Kysely<DB>,
  req: { params: DeleteArticleCommentParams; jwt: JwtToken },
) {
  const result = await db
    .deleteFrom("article_comments")
    .where((eb) =>
      eb.and([
        eb("id", "=", req.params.id),
        eb(
          "author_id",
          "=",
          eb
            .selectFrom("users")
            .select("id")
            .where("username", "=", req.jwt.user.username),
        ),
      ]),
    )
    .executeTakeFirst();

  return !!result.numDeletedRows;
}
