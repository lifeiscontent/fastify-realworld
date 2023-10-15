import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { JwtToken } from "../schemas/jwt-token.js";

export async function getUserIdByJwt(db: Kysely<DB>, req: { jwt: JwtToken }) {
  const user = await db
    .selectFrom("users")
    .select("users.id")
    .where("users.username", "=", req.jwt.user.username)
    .executeTakeFirst();

  return user?.id;
}
