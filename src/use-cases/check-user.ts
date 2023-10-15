import type { Kysely } from "kysely";
import { sql } from "kysely";
import type { DB } from "kysely-codegen";

export async function checkUser(
  db: Kysely<DB>,
  req: { params: { username: string } },
) {
  const { exists } = await db
    .selectNoFrom((eb) => [
      eb
        .exists(
          eb
            .selectFrom("users")
            .select(sql<number>`1`.as("one"))
            .where("username", "=", req.params.username),
        )
        .$castTo<boolean>()
        .as("exists"),
    ])
    .executeTakeFirst()
    .then((row) => row ?? { exists: false });

  return exists;
}
