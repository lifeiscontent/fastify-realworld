import assert from "node:assert";
import { after, afterEach, beforeEach, describe, it } from "node:test";
import app from "../../app.js";
import type { Article } from "../../schemas/article.js";
import { createArticle } from "../../use-cases/create-article.js";
import { createUser } from "../../use-cases/create-user.js";
import { deleteUser } from "../../use-cases/delete-user.js";
import { getArticle } from "../../use-cases/get-article.js";
import { getArticlesFeed } from "../../use-cases/get-articles-feed.js";
import { getArticles } from "../../use-cases/get-articles.js";
import { createJwtToken, getJwtToken } from "../../utils/token.js";

after(async () => {
  await app.close();
});

describe("GET /articles route", () => {
  const articles = [] satisfies Article[];

  it("should return a 200 response", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/articles",
    });

    assert.equal(response.statusCode, 200);
    assert.deepStrictEqual(response.json(), {
      articles,
      articlesCount: String(articles.length),
    });
  });

  describe("when articles exists", async () => {
    beforeEach(async () => {
      await createUser(app.kysely, {
        body: {
          user: {
            email: "some-user@example.com",
            password: "password",
            username: "some-user",
          },
        },
      });
      const jwt = getJwtToken(
        createJwtToken({
          email: "some-user@example.com",
          username: "some-user",
        }),
      );
      assert(jwt, "jwt is required");
      await createArticle(app.kysely, {
        body: {
          article: {
            title: "Some Article",
            description: "Some description",
            body: "Some body",
            tagList: [],
          },
        },
        jwt,
      });
    });

    afterEach(async () => {
      const jwt = getJwtToken(
        createJwtToken({
          email: "some-user@example.com",
          username: "some-user",
        }),
      );
      assert(jwt, "jwt is required");
      await deleteUser(app.kysely, { jwt });
    });

    it("should return a 200 response", async () => {
      const articles = await getArticles(app.kysely);

      const response = await app.inject({
        method: "GET",
        url: "/api/articles",
      });

      assert.equal(response.statusCode, 200);
      assert.deepStrictEqual(response.json(), articles);
    });
  });
});

describe("GET /articles/feed route", () => {
  it("should return a 401 response", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/articles/feed",
    });

    assert.equal(response.statusCode, 401);
    assert.deepStrictEqual(response.json(), {
      message: "missing authorization credentials",
      status: "error",
    });
  });

  describe("when a valid token exists", () => {
    const token = createJwtToken({
      username: "some-user",
      email: "some-user@example.com",
    });

    describe("when articles exists", () => {
      beforeEach(async () => {
        await createUser(app.kysely, {
          body: {
            user: {
              email: "some-user@example.com",
              password: "password",
              username: "some-user",
            },
          },
        });
        const jwt = getJwtToken(token);
        assert(jwt, "jwt is required");
        await createArticle(app.kysely, {
          body: {
            article: {
              title: "Some Article",
              description: "Some description",
              body: "Some body",
              tagList: [],
            },
          },
          jwt,
        });
      });

      afterEach(async () => {
        const jwt = getJwtToken(
          createJwtToken({
            email: "some-user@example.com",
            username: "some-user",
          }),
        );
        assert(jwt, "jwt is required");
        await deleteUser(app.kysely, { jwt });
      });

      it("should return a 200 response", async () => {
        const articles = await getArticlesFeed(app.kysely, {
          jwt: getJwtToken(token)!,
        });

        const response = await app.inject({
          method: "GET",
          url: "/api/articles/feed",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        assert.equal(response.statusCode, 200);
        assert.deepStrictEqual(response.json(), articles);
      });
    });
  });
});

describe("GET /articles/:slug route", () => {
  it("should return a 404 response", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/articles/some-article",
    });

    assert.equal(response.statusCode, 404);
    assert.deepStrictEqual(response.json(), {
      message: "Article not found",
      status: "error",
    });
  });

  describe("when the article exists", () => {
    beforeEach(async () => {
      await createUser(app.kysely, {
        body: {
          user: {
            email: "some-user@example.com",
            password: "password",
            username: "some-user",
          },
        },
      });
      const jwt = getJwtToken(
        createJwtToken({
          email: "some-user@example.com",
          username: "some-user",
        }),
      );
      assert(jwt, "jwt is required");
      await createArticle(app.kysely, {
        body: {
          article: {
            title: "Some Article",
            description: "Some description",
            body: "Some body",
            tagList: [],
          },
        },
        jwt,
      });
    });

    afterEach(async () => {
      const jwt = getJwtToken(
        createJwtToken({
          email: "some-user@example.com",
          username: "some-user",
        }),
      );
      assert(jwt, "jwt is required");
      await deleteUser(app.kysely, { jwt });
    });

    it("should return a 200 response", async () => {
      const articles = await getArticles(app.kysely);
      const article = await getArticle(app.kysely, {
        params: { slug: articles.articles[0].slug },
      });
      const response = await app.inject({
        method: "GET",
        url: `/api/articles/${articles.articles[0].slug}`,
      });

      assert.equal(response.statusCode, 200);
      assert.deepStrictEqual(response.json(), {
        article,
      });
    });
  });
});
