import { Type } from "@sinclair/typebox";

export const GenericErrorSchema = Type.Object({
  status: Type.String(),
  message: Type.String(),
});
