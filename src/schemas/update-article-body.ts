import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const UpdateArticleBodySchema = Type.Object({
  article: Type.Object({
    title: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    body: Type.Optional(Type.String()),
  }),
});

export type UpdateArticleBody = Static<typeof UpdateArticleBodySchema>;
