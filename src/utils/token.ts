import { Value } from "@sinclair/typebox/value";
import jwt from "jsonwebtoken";
import { JwtTokenSchema } from "../schemas/jwt-token.js";
import type { User } from "../schemas/user.js";

export function createJwtToken({
  email,
  username,
}: Pick<User, "email" | "username">) {
  return jwt.sign(
    { user: { email, username } },
    process.env.JWT_SECRET ?? "superSecret",
    {
      expiresIn: "60d",
    },
  );
}

export function getJwtToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "superSecret");
    if (Value.Check(JwtTokenSchema, decoded)) {
      // TODO check if jwt is not expired
      return decoded;
    }
  } catch {
    return undefined;
  }
}
