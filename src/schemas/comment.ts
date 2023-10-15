import type { Static } from "@sinclair/typebox";
import { Type } from "@sinclair/typebox";

export const CommentSchema = Type.Object({
  id: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
  body: Type.String(),
  author: Type.Object({
    username: Type.String(),
    bio: Type.String(),
    image: Type.String(),
    following: Type.Boolean(),
  }),
});

export type Comment = Static<typeof CommentSchema>;
