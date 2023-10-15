import type { Kysely } from "kysely";
import { sql } from "kysely";
import type { DB } from "kysely-codegen";

export async function checkArticle(
  db: Kysely<DB>,
  req: { params: { slug: string } },
) {
  const { exists } = await db
    .selectNoFrom((eb) => [
      eb
        .exists(
          eb
            .selectFrom("articles")
            .select(sql<number>`1`.as("one"))
            .where("slug", "=", req.params.slug),
        )
        .$castTo<boolean>()
        .as("exists"),
    ])
    .executeTakeFirst()
    .then((row) => row ?? { exists: false });

  return exists;
}
