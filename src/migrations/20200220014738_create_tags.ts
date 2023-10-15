import type { Kysely } from "kysely";
import { addUpdatedAtTrigger, withTimestamps } from "../utils/migrations.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("tags")
    .addColumn("id", "bigserial", (col) => col.primaryKey().notNull())
    .$call(withTimestamps)
    .addColumn("name", "varchar", (col) => col.notNull().unique())
    .execute();

  await addUpdatedAtTrigger("tags").execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("tags").execute();
}
