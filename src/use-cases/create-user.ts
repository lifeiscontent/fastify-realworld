import bcrypt from "bcryptjs";
import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { CreateUserBody } from "../../src/schemas/create-user-body.js";
import type { User } from "../schemas/user.js";
import { createJwtToken } from "../utils/token.js";

export async function createUser(
  db: Kysely<DB>,
  req: { body: CreateUserBody },
): Promise<User> {
  const encrypted_password = await bcrypt.hash(req.body.user.password, 10);

  const insertedUser = await db
    .insertInto("users")
    .values({
      bio: req.body.user.bio,
      email: req.body.user.email,
      encrypted_password,
      image: req.body.user.image,
      username: req.body.user.username,
    })
    .onConflict((cb) => cb.doNothing())
    .returningAll()
    .executeTakeFirstOrThrow();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { encrypted_password: _, ...userWithoutPassword } = insertedUser;

  return {
    ...userWithoutPassword,
    token: createJwtToken(userWithoutPassword),
  };
}
