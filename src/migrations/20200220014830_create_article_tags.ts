import type { Kysely } from "kysely";
import { addUpdatedAtTrigger, withTimestamps } from "../utils/migrations.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("article_tags")
    .addColumn("id", "bigserial", (col) => col.primaryKey().notNull())
    .$call(withTimestamps)
    .addColumn("article_id", "bigserial", (col) =>
      col.references("articles.id").onDelete("cascade").notNull(),
    )
    .addColumn("tag_id", "bigserial", (col) =>
      col.references("tags.id").onDelete("cascade").notNull(),
    )
    .execute();

  await addUpdatedAtTrigger("article_tags").execute(db);
  await db.schema
    .createIndex("article_tags_article_id_tag_id_unqiue")
    .unique()
    .on("article_tags")
    .columns(["article_id", "tag_id"])
    .execute();
  await db.schema
    .createIndex("article_tags_tag_id")
    .on("article_tags")
    .columns(["tag_id"])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("article_tags").execute();
}
