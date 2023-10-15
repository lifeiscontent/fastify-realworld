import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const DeleteArticleCommentParamsSchema = Type.Object({
  slug: Type.String(),
  id: Type.String(),
});

export type DeleteArticleCommentParams = Static<
  typeof DeleteArticleCommentParamsSchema
>;
