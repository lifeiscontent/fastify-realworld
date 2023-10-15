import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const UnfavoriteArticleParamsSchema = Type.Object({
  slug: Type.String(),
});

export type UnfavoriteArticleParams = Static<
  typeof UnfavoriteArticleParamsSchema
>;
