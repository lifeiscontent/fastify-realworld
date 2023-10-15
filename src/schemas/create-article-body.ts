import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const CreateArticleBodySchema = Type.Object({
  article: Type.Object({
    title: Type.String(),
    description: Type.String(),
    body: Type.String(),
    tagList: Type.Array(Type.String()),
  }),
});

export type CreateArticleBody = Static<typeof CreateArticleBodySchema>;
