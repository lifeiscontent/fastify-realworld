import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { Kysely, PostgresDialect } from "kysely";
import * as path from "node:path";
import pg from "pg";

import type { DB } from "kysely-codegen";

async function seed() {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  });

  const tags = await db
    .insertInto("tags")
    .values(
      [
        "programming",
        "javascript",
        "emberjs",
        "angularjs",
        "react",
        "mean",
        "node",
        "rails",
      ].map((name) => ({
        name,
      })),
    )
    .returning("id")
    .execute();

  for (let i = 0; i < 10; i++) {
    const user = await db
      .insertInto("users")
      .values({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        bio: faker.lorem.paragraph(),
        image: faker.internet.avatar(),
        encrypted_password: await bcrypt.hash("password", 10),
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    for (let i = 0; i < 20; i++) {
      const article = await db
        .insertInto("articles")
        .values({
          author_id: user.id,
          body: faker.lorem.paragraphs(10),
          description: faker.lorem.sentence(),
          slug: faker.lorem.slug(),
          title: faker.lorem.sentence(),
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      await db
        .insertInto("article_tags")
        .values({
          article_id: article.id,
          tag_id: tags[Math.floor(Math.random() * tags.length)].id,
        })
        .execute();

      for (let i = 0; i < 5; i++) {
        const { userCount } = await db
          .selectFrom("users")
          .select((eb) => eb.fn.countAll<string>().as("userCount"))
          .executeTakeFirstOrThrow();

        const randomUser = await db
          .selectFrom("users")
          .offset(Math.floor(Number(userCount) * Math.random()))
          .select("id")
          .executeTakeFirstOrThrow();

        await db
          .insertInto("article_comments")
          .values({
            article_id: article.id,
            author_id: randomUser.id,
            body: faker.lorem.paragraph(),
          })
          .execute();
      }
    }
  }

  await db.destroy();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
