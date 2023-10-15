import type { CreateTableBuilder } from "kysely";
import { sql } from "kysely";

export function withTimestamps<TB extends string, C extends string = never>(
  ctb: CreateTableBuilder<TB, C>,
): CreateTableBuilder<TB, C> {
  return ctb
    .addColumn("created_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn("updated_at", "timestamptz", (col) =>
      col.defaultTo(sql`now()`).notNull(),
    );
}

export function addUpdatedAtTrigger(table: string) {
  return sql`CREATE TRIGGER update_${sql.raw(table)}_updated_at
    BEFORE UPDATE ON ${sql.raw(table)}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();`;
}
