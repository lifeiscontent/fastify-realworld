import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const GetArticleParams = Type.Object({
  slug: Type.String(),
});

export type GetArticleParams = Static<typeof GetArticleParams>;
