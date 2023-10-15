import bcrypt from "bcryptjs";
import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { LoginBody } from "../schemas/login-body.js";
import type { User } from "../schemas/user.js";
import { createJwtToken } from "../utils/token.js";

export const login = async (
  db: Kysely<DB>,
  req: { body: LoginBody },
): Promise<User | undefined> => {
  const userWithPassword = await db
    .selectFrom("users")
    .select(["bio", "email", "username", "image", "encrypted_password"])
    .where("email", "=", req.body.user.email)
    .executeTakeFirst();

  if (userWithPassword) {
    const match = await bcrypt.compare(
      req.body.user.password,
      userWithPassword.encrypted_password,
    );

    if (match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { encrypted_password: _, ...userWithoutPassword } =
        userWithPassword;
      return {
        ...userWithoutPassword,
        token: createJwtToken(userWithoutPassword),
      };
    }
  }
};
