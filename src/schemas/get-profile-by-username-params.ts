import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const GetProfileByUsernameParamsSchema = Type.Object({
  username: Type.String(),
});

export type GetProfileByUsernameParams = Static<
  typeof GetProfileByUsernameParamsSchema
>;
