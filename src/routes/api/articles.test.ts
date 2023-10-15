import { describe, expect, it, vi } from "vitest";
import app from "../../app.js";
import { Article } from "../../schemas/article.js";
import { createJwtToken } from "../../utils/token.js";

const getArticles = vi.fn();
const getArticle = vi.fn();
const getArticlesFeed = vi.fn();
const createArticle = vi.fn();
const checkArticle = vi.fn();
const updateArticle = vi.fn();
const deleteArticle = vi.fn();
const favoriteArticle = vi.fn();
const unfavoriteArticle = vi.fn();
const getArticleComments = vi.fn();
const getArticleComment = vi.fn();
const addArticleComment = vi.fn();
const checkArticleComment = vi.fn();
const deleteArticleComment = vi.fn();

vi.mock("../../use-cases/get-articles.js", () => ({
  getArticles,
}));

vi.mock("../../use-cases/get-articles-feed.js", () => ({
  getArticlesFeed,
}));

vi.mock("../../use-cases/create-article.js", () => ({
  createArticle,
}));

vi.mock("../../use-cases/get-article.js", () => ({
  getArticle,
}));

vi.mock("../../use-cases/check-article.js", () => ({
  checkArticle,
}));

vi.mock("../../use-cases/update-article.js", () => ({
  updateArticle,
}));

vi.mock("../../use-cases/delete-article.js", () => ({
  deleteArticle,
}));

vi.mock("../../use-cases/favorite-article.js", () => ({
  favoriteArticle,
}));

vi.mock("../../use-cases/unfavorite-article.js", () => ({
  unfavoriteArticle,
}));

vi.mock("../../use-cases/get-article-comments.js", () => ({
  getArticleComments,
}));

vi.mock("../../use-cases/get-article-comment.js", () => ({
  getArticleComment,
}));

vi.mock("../../use-cases/add-article-comment.js", () => ({
  addArticleComment,
}));

vi.mock("../../use-cases/check-article-comment.js", () => ({
  checkArticleComment,
}));

vi.mock("../../use-cases/delete-article-comment.js", () => ({
  deleteArticleComment,
}));

describe("GET /articles route", () => {
  const articles = [] satisfies Article[];

  it("should return a 200 response", async () => {
    getArticles.mockImplementationOnce(() =>
      Promise.resolve({
        articles,
        articlesCount: String(articles.length),
      }),
    );

    const response = await app.inject({
      method: "GET",
      url: "/api/articles",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      articles,
      articlesCount: String(articles.length),
    });
    expect(getArticles).toHaveBeenCalledWith({});
  });

  describe("when articles exists", () => {
    const articles = [
      {
        slug: "some-article",
        title: "Some Article",
        description: "Some description",
        body: "Some body",
        tagList: [],
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        favorited: false,
        favoritesCount: "0",
        author: {
          bio: null,
          image: null,
          following: false,
          username: "some-user",
        },
      },
    ] satisfies Article[];

    it("should return a 200 response", async () => {
      getArticles.mockImplementationOnce(() =>
        Promise.resolve({
          articles,
          articlesCount: String(articles.length),
        }),
      );

      const response = await app.inject({
        method: "GET",
        url: "/api/articles",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        articles,
        articlesCount: String(articles.length),
      });
    });
  });
});

describe("GET /articles/feed route", () => {
  it("should return a 401 response", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/articles/feed",
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({
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
      const articles = [
        {
          slug: "some-article",
          title: "Some Article",
          description: "Some description",
          body: "Some body",
          tagList: [],
          createdAt: new Date().toJSON(),
          updatedAt: new Date().toJSON(),
          favorited: false,
          favoritesCount: "0",
          author: {
            bio: null,
            image: null,
            following: false,
            username: "some-user",
          },
        },
      ] satisfies Article[];

      it("should return a 200 response", async () => {
        getArticlesFeed.mockImplementationOnce(() =>
          Promise.resolve({
            articles,
            articlesCount: String(articles.length),
          }),
        );

        const response = await app.inject({
          method: "GET",
          url: "/api/articles/feed",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        expect(response.statusCode).toBe(200);
        expect(response.json()).toEqual({
          articles,
          articlesCount: String(articles.length),
        });
      });
    });
  });
});

describe("GET /articles/:slug route", () => {
  const article = undefined;
  it("should return a 404 response", async () => {
    getArticle.mockImplementationOnce(() => Promise.resolve(article));

    const response = await app.inject({
      method: "GET",
      url: "/api/articles/some-article",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      message: "Article not found",
      status: "error",
    });
  });

  describe("when the article exists", () => {
    it("should return a 200 response", async () => {
      const article = {
        slug: "some-article",
        title: "Some Article",
        description: "Some description",
        body: "Some body",
        tagList: [],
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
        favorited: false,
        favoritesCount: "0",
        author: {
          bio: null,
          image: null,
          following: false,
          username: "some-user",
        },
      } satisfies Article;
      getArticle.mockImplementationOnce(() => Promise.resolve(article));

      const response = await app.inject({
        method: "GET",
        url: "/api/articles/some-article",
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        article,
      });
    });
  });
});
