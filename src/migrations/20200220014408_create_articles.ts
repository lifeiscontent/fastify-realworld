import type { Kysely } from "kysely";
import { addUpdatedAtTrigger, withTimestamps } from "../utils/migrations.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("articles")
    .addColumn("id", "bigserial", (col) => col.primaryKey().notNull())
    .$call(withTimestamps)
    .addColumn("slug", "varchar", (col) => col.notNull().unique())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar", (col) => col.notNull())
    .addColumn("body", "text", (col) => col.notNull())
    .addColumn("favorites_count", "integer", (col) =>
      col.notNull().defaultTo(0),
    )
    .addColumn("author_id", "bigserial", (col) =>
      col.references("users.id").onDelete("cascade").notNull(),
    )
    .execute();

  await addUpdatedAtTrigger("articles").execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("articles").execute();
}
