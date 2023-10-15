import { Type } from "@sinclair/typebox";

export const ValidationErrorSchema = Type.Object({
  errors: Type.Record(Type.String(), Type.Array(Type.String())),
});
