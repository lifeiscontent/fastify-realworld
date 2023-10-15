import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const UnfollowUserByUsernameParamsSchema = Type.Object({
  username: Type.String(),
});

export type UnfollowUserByUsernameParams = Static<
  typeof UnfollowUserByUsernameParamsSchema
>;
