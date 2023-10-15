import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";

export async function getTags(db: Kysely<DB>) {
  const tags = await db.selectFrom("tags").select("name").execute();

  return tags.map((tag) => tag.name);
}
