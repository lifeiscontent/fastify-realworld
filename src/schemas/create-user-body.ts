import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const CreateUserBodySchema = Type.Object({
  user: Type.Object({
    bio: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    email: Type.String({ format: "email" }),
    image: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    password: Type.String(),
    username: Type.String(),
  }),
});

export type CreateUserBody = Static<typeof CreateUserBodySchema>;
