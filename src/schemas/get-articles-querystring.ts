import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const GetArticlesQuerystringSchema = Type.Object({
  author: Type.Optional(Type.String()),
  favorited: Type.Optional(Type.String()),
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
  tag: Type.Optional(Type.String()),
});

export type GetArticlesQuerystring = Static<
  typeof GetArticlesQuerystringSchema
>;
