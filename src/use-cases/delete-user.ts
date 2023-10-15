import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { JwtToken } from "../schemas/jwt-token.js";

export async function deleteUser(db: Kysely<DB>, req: { jwt: JwtToken }) {
  const result = await db
    .deleteFrom("users")
    .where("users.username", "=", req.jwt.user.username)
    .executeTakeFirst();

  return !!result.numDeletedRows;
}
