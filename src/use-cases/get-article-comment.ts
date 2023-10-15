import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { following } from "../kysely/users.js";
import type { Comment } from "../schemas/comment.js";
import type { GetArticleCommentParams } from "../schemas/get-article-comment-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";
import { toISOString } from "../utils/kysely.js";

export async function getArticleComment(
  db: Kysely<DB>,
  req: { params: GetArticleCommentParams; jwt?: JwtToken },
): Promise<Comment | undefined> {
  return await db
    .selectFrom("article_comments")
    .select((eb) => [
      "article_comments.id",
      "article_comments.body",
      toISOString(eb, "article_comments.created_at").as("createdAt"),
      toISOString(eb, "article_comments.updated_at").as("updatedAt"),
      jsonObjectFrom(
        eb
          .selectFrom("users")
          .select((eb) => [
            "users.bio",
            "users.image",
            "users.username",
            following(eb, req.jwt?.user.username).as("following"),
          ])
          .whereRef("users.id", "=", "article_comments.author_id"),
      )
        .$castTo<Comment["author"]>()
        .as("author"),
    ])
    .where((eb) =>
      eb.and([
        eb(
          "article_id",
          "=",
          eb
            .selectFrom("articles")
            .select("articles.id")
            .where("articles.slug", "=", req.params.slug),
        ),
        eb("article_comments.id", "=", req.params.id),
      ]),
    )
    .executeTakeFirst();
}
