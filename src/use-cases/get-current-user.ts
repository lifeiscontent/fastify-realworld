import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { JwtToken } from "../schemas/jwt-token.js";
import { createJwtToken } from "../utils/token.js";

export async function getCurrentUser(db: Kysely<DB>, req: { jwt: JwtToken }) {
  const userWithEncryptedPassword = await db
    .selectFrom("users")
    .select(["bio", "email", "username", "image", "encrypted_password"])
    .where("username", "=", req.jwt.user.username)
    .executeTakeFirst();

  if (!userWithEncryptedPassword) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { encrypted_password: _, ...userWithoutPassword } =
    userWithEncryptedPassword;

  return {
    ...userWithoutPassword,
    token: createJwtToken(userWithoutPassword),
  };
}
