import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const AddArticleCommentBodySchema = Type.Object({
  comment: Type.Object({
    body: Type.String(),
  }),
});

export type AddArticleCommentBody = Static<typeof AddArticleCommentBodySchema>;
