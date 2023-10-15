import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const LoginBodySchema = Type.Object({
  user: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String(),
  }),
});

export type LoginBody = Static<typeof LoginBodySchema>;
