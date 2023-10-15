import type { Kysely } from "kysely";
import type { DB } from "kysely-codegen";
import { following } from "../kysely/users.js";
import type { GetProfileByUsernameParams } from "../schemas/get-profile-by-username-params.js";
import type { JwtToken } from "../schemas/jwt-token.js";
import type { Profile } from "../schemas/profile.js";

export async function getProfileByUsername(
  db: Kysely<DB>,
  req: { params: GetProfileByUsernameParams; jwt?: JwtToken },
): Promise<Profile | undefined> {
  const qb = db
    .selectFrom("users")
    .select((eb) => [
      "id",
      "username",
      "bio",
      "image",
      following(eb, req.jwt?.user.username).as("following"),
    ])
    .where("username", "=", req.params.username);

  return await qb.executeTakeFirst();
}
