import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const FollowUserByUsernameParamsSchema = Type.Object({
  username: Type.String(),
});

export type FollowUserByUsernameParams = Static<
  typeof FollowUserByUsernameParamsSchema
>;
