import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const DeleteArticleParamsSchema = Type.Object({
  slug: Type.String(),
});

export type DeleteArticleParams = Static<typeof DeleteArticleParamsSchema>;
