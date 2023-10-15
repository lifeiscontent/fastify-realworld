import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const GetArticleCommentsParamsSchema = Type.Object({
  slug: Type.String(),
});

export type GetArticleCommentsParams = Static<
  typeof GetArticleCommentsParamsSchema
>;
