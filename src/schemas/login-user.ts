import { Type } from "@sinclair/typebox";

export const LoginUserSchema = Type.Object({
  email: Type.String({
    format: "email",
  }),
  password: Type.String({
    format: "password",
  }),
});
