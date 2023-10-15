import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import type { DB } from "kysely-codegen";

export function following(
  eb: ExpressionBuilder<DB, "users">,
  username: string | null | undefined = null,
) {
  return eb
    .exists(
      eb
        .selectFrom("relationships")
        .select(sql<number>`1`.as("one"))
        .whereRef("relationships.followed_id", "=", "users.id")
        .where((web) =>
          web(
            "relationships.follower_id",
            "=",
            web
              .selectFrom("users")
              .select("users.id")
              .where("users.username", "=", username),
          ),
        ),
    )
    .$castTo<boolean>();
}
