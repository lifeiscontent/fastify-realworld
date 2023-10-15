import type { Kysely } from "kysely";
import { sql } from "kysely";
import type { DB } from "kysely-codegen";

export async function checkArticleComment(
  db: Kysely<DB>,
  req: { params: { id: string } },
) {
  const { exists } = await db
    .selectNoFrom((eb) => [
      eb
        .exists(
          eb
            .selectFrom("article_comments")
            .select(sql<number>`1`.as("one"))
            .where("article_comments.id", "=", req.params.id),
        )
        .$castTo<boolean>()
        .as("exists"),
    ])
    .executeTakeFirst()
    .then((row) => row ?? { exists: false });

  return exists;
}
