import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const FavoriteArticleParamsSchema = Type.Object({
  slug: Type.String(),
});

export type FavoriteArticleParams = Static<typeof FavoriteArticleParamsSchema>;
