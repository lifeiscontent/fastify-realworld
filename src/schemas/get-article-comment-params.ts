import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const GetArticleCommentParamsSchema = Type.Object({
  slug: Type.String(),
  id: Type.String(),
});

export type GetArticleCommentParams = Static<
  typeof GetArticleCommentParamsSchema
>;
