import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const ArticleSchema = Type.Object({
  slug: Type.String(),
  title: Type.String(),
  description: Type.String(),
  body: Type.String(),
  tagList: Type.Array(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
  favorited: Type.Boolean(),
  favoritesCount: Type.String(),
  author: Type.Object({
    username: Type.String(),
    bio: Type.Union([Type.String(), Type.Null()]),
    image: Type.Union([Type.String(), Type.Null()]),
    following: Type.Boolean(),
  }),
});

export type Article = Static<typeof ArticleSchema>;
