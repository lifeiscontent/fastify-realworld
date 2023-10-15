import type { Kysely } from "kysely";
import { addUpdatedAtTrigger, withTimestamps } from "../utils/migrations.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("article_comments")
    .addColumn("id", "bigserial", (col) => col.primaryKey().notNull())
    .$call(withTimestamps)
    .addColumn("body", "text", (col) => col.notNull())
    .addColumn("article_id", "bigserial", (col) =>
      col.references("articles.id").onDelete("cascade").notNull(),
    )
    .addColumn("author_id", "bigserial", (col) =>
      col.references("users.id").onDelete("cascade").notNull(),
    )
    .execute();

  await addUpdatedAtTrigger("article_comments").execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("article_comments").execute();
}
