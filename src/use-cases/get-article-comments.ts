import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { following } from "../kysely/users.js";
import type { Comment } from "../schemas/comment.js";
import type { GetArticleCommentsParams } from "../schemas/get-article-comments-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";
import { toISOString } from "../utils/kysely.js";

export async function getArticleComments(
  db: Kysely<DB>,
  req: { params: GetArticleCommentsParams; jwt?: JwtToken },
): Promise<Comment[]> {
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
      eb(
        "article_id",
        "=",
        eb
          .selectFrom("articles")
          .select("articles.id")
          .where("articles.slug", "=", req.params.slug),
      ),
    )
    .execute();
}
