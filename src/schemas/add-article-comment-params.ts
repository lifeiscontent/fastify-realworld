import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const AddArticleCommentParamsSchema = Type.Object({
  slug: Type.String(),
});

export type AddArticleCommentParams = Static<
  typeof AddArticleCommentParamsSchema
>;
