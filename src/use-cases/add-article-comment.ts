import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { AddArticleCommentBody } from "../schemas/add-article-comment-body.js";
import type { AddArticleCommentParams } from "../schemas/add-article-comment-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";

export async function addArticleComment(
  db: Kysely<DB>,
  req: {
    params: AddArticleCommentParams;
    body: AddArticleCommentBody;
    jwt: JwtToken;
  },
) {
  const result = await db
    .insertInto("article_comments")
    .values((eb) => ({
      article_id: eb
        .selectFrom("articles")
        .select("articles.id")
        .where("articles.slug", "=", req.params.slug),
      author_id: eb
        .selectFrom("users")
        .select("users.id")
        .where("users.username", "=", req.jwt.user.username),
      body: req.body.comment.body,
    }))
    .returning("id")
    .executeTakeFirst();
  return result;
}
