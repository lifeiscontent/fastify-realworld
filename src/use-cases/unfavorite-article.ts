import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { JwtToken } from "../schemas/jwt-token.js";
import type { UnfavoriteArticleParams } from "../schemas/unfavorite-article-params.js";

export async function unfavoriteArticle(
  db: Kysely<DB>,
  req: { params: UnfavoriteArticleParams; jwt: JwtToken },
) {
  const result = await db
    .deleteFrom("user_favorite_articles")
    .where((eb) =>
      eb.and({
        article_id: eb
          .selectFrom("articles")
          .select("articles.id")
          .where("articles.slug", "=", req.params.slug),
        user_id: eb
          .selectFrom("users")
          .select("users.id")
          .where("users.username", "=", req.jwt.user.username),
      }),
    )

    .executeTakeFirst();

  return !!result.numDeletedRows;
}
