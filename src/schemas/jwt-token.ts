import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const JwtTokenSchema = Type.Object({
  user: Type.Object({
    email: Type.String(),
    username: Type.String(),
  }),
  iat: Type.Number(),
  exp: Type.Number(),
});

export type JwtToken = Static<typeof JwtTokenSchema>;
