import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import type { FavoriteArticleParams } from "../schemas/favorite-article-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";

export async function favoriteArticle(
  db: Kysely<DB>,
  req: { params: FavoriteArticleParams; jwt: JwtToken },
) {
  const result = await db
    .insertInto("user_favorite_articles")
    .values((eb) => ({
      article_id: eb
        .selectFrom("articles")
        .select("articles.id")
        .where("articles.slug", "=", req.params.slug),
      user_id: eb
        .selectFrom("users")
        .select("users.id")
        .where("users.username", "=", req.jwt.user.username),
    }))
    .onConflict((cb) => cb.doNothing())
    .executeTakeFirst();

  return !!result.numInsertedOrUpdatedRows;
}
