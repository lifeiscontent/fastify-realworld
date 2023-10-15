import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import type { DB } from "kysely-codegen";

export function favorited(
  eb: ExpressionBuilder<DB, "articles">,
  username: undefined | string | null = null,
) {
  return eb
    .exists(
      eb
        .selectFrom("user_favorite_articles")
        .select(sql<number>`1`.as("one"))
        .where((web) =>
          web(
            "user_favorite_articles.user_id",
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

export function tagList(eb: ExpressionBuilder<DB, "articles">) {
  return eb.fn.coalesce(
    eb
      .selectFrom("article_tags")
      .leftJoin("tags", "tags.id", "article_tags.tag_id")
      .whereRef("article_tags.article_id", "=", "articles.id")
      .select((eb) =>
        eb.fn.agg<string[] | null>("json_agg", ["tags.name"]).as("tagList"),
      ),
    sql<string[]>`'[]'::json`,
  );
}
