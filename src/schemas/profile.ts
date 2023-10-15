import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const ProfileSchema = Type.Object({
  username: Type.String(),
  bio: Type.Union([Type.String(), Type.Null()]),
  image: Type.Union([Type.String(), Type.Null()]),
  following: Type.Boolean(),
});

export type Profile = Static<typeof ProfileSchema>;
