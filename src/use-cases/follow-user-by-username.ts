import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { FollowUserByUsernameParams } from "../schemas/follow-user-by-username-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";

export async function followUserByUsername(
  db: Kysely<DB>,
  req: { params: FollowUserByUsernameParams; jwt: JwtToken },
) {
  const result = await db
    .insertInto("relationships")
    .values((eb) => ({
      follower_id: eb
        .selectFrom("users")
        .select("id")
        .where("username", "=", req.jwt.user.username),
      followed_id: eb
        .selectFrom("users")
        .select("id")
        .where("username", "=", req.params.username),
    }))
    .onConflict((cb) => cb.doNothing())
    .executeTakeFirst();

  return !!result.numInsertedOrUpdatedRows;
}
