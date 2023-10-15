import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { JwtToken } from "../schemas/jwt-token.js";
import type { UnfollowUserByUsernameParams } from "../schemas/unfollow-user-by-username-params.js";

export async function unfollowUserByUsername(
  db: Kysely<DB>,
  req: { params: UnfollowUserByUsernameParams; jwt: JwtToken },
) {
  const result = await db
    .deleteFrom("relationships")
    .where(
      "follower_id",
      "=",
      db
        .selectFrom("users")
        .select("id")
        .where("username", "=", req.jwt.user.username),
    )
    .where(
      "followed_id",
      "=",
      db
        .selectFrom("users")
        .select("id")
        .where("username", "=", req.params.username),
    )
    .executeTakeFirst();

  return !!result.numDeletedRows;
}
