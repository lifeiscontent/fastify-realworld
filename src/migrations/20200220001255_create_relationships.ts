import type { Kysely } from "kysely";
import { addUpdatedAtTrigger, withTimestamps } from "../utils/migrations.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("relationships")
    .$call(withTimestamps)
    .addColumn("followed_id", "bigserial", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .addColumn("follower_id", "bigserial", (col) =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .execute();

  await addUpdatedAtTrigger("relationships").execute(db);
  await db.schema
    .createIndex("relationships_followed_id_follower_id_unqiue")
    .unique()
    .on("relationships")
    .columns(["followed_id", "follower_id"])
    .execute();
  await db.schema
    .createIndex("relationships_follower_id")
    .on("relationships")
    .columns(["follower_id"])
    .execute();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("relationships").execute();
}
