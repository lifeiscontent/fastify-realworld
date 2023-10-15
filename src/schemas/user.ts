import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
  email: Type.String({ format: "email" }),
  token: Type.String(),
  username: Type.String(),
  bio: Type.Union([Type.String(), Type.Null()]),
  image: Type.Union([Type.String(), Type.Null()]),
});

export type User = Static<typeof UserSchema>;
