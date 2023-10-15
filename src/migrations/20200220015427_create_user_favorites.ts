import type { Kysely } from "kysely";
import { addUpdatedAtTrigger, withTimestamps } from "../utils/migrations.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user_favorite_articles")
    .$call(withTimestamps)
    .addColumn("article_id", "bigserial", (col) =>
      col.references("articles.id").onDelete("cascade").notNull(),
    )
    .addColumn("user_id", "bigserial", (col) =>
      col.references("users.id").onDelete("cascade").notNull(),
    )
    .execute();

  await addUpdatedAtTrigger("user_favorite_articles").execute(db);
  await db.schema
    .createIndex("user_favorite_articles_article_id_user_id_unqiue")
    .unique()
    .on("user_favorite_articles")
    .columns(["article_id", "user_id"])
    .execute();

  await db.schema
    .createIndex("user_favorite_articles_user_id")
    .on("user_favorite_articles")
    .columns(["user_id"])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_favorite_articles").execute();
}
