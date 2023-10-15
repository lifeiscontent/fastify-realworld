import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const UpdateCurrentUserBody = Type.Object({
  user: Type.Object({
    email: Type.Optional(Type.String({ format: "email" })),
    token: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    bio: Type.Optional(Type.String()),
    image: Type.Optional(Type.String()),
  }),
});

export type UpdateCurrentUserBody = Static<typeof UpdateCurrentUserBody>;
