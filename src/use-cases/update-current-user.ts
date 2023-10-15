import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { JwtToken } from "../schemas/jwt-token.js";
import type { UpdateCurrentUserBody } from "../schemas/user-current-user-body.js";

export async function updateCurrentUser(
  db: Kysely<DB>,
  req: { body: UpdateCurrentUserBody; jwt: JwtToken },
) {
  const result = await db
    .updateTable("users")
    .set({
      bio: req.body.user.bio,
      email: req.body.user.email,
      image: req.body.user.image,
      username: req.body.user.username,
    })
    .where("username", "=", req.jwt.user.username)
    .executeTakeFirst();

  return !!result.numUpdatedRows;
}
