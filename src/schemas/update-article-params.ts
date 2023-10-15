import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const UpdateArticleParamsSchema = Type.Object({
  slug: Type.String(),
});

export type UpdateArticleParams = Static<typeof UpdateArticleParamsSchema>;
