import type { ExpressionBuilder, ReferenceExpression } from "kysely";
import { sql } from "kysely";

export function toISOString<DB, TB extends keyof DB>(
  eb: ExpressionBuilder<DB, TB>,
  column: ReferenceExpression<DB, TB>,
) {
  return eb.fn<string>("to_char", [
    column,
    sql.raw('\'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"\''),
  ]);
}
