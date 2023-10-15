import type { Kysely } from "kysely";
import { addUpdatedAtTrigger, withTimestamps } from "../utils/migrations.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "bigserial", (col) => col.primaryKey().notNull())
    .$call(withTimestamps)
    .addColumn("email", "varchar", (col) => col.notNull().unique())
    .addColumn("username", "varchar", (col) => col.notNull().unique())
    .addColumn("encrypted_password", "varchar", (col) => col.notNull())
    .addColumn("image", "text", (col) =>
      col.defaultTo(
        "https://realworld-temp-api.herokuapp.com/images/smiley-cyrus.jpeg",
      ),
    )
    .addColumn("bio", "text")
    .execute();

  await addUpdatedAtTrigger("users").execute(db);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
