import { Type } from "@sinclair/typebox";
import { AddArticleCommentBodySchema } from "../../schemas/add-article-comment-body.js";
import { AddArticleCommentParamsSchema } from "../../schemas/add-article-comment-params.js";
import { ArticleSchema } from "../../schemas/article.js";
import { CommentSchema } from "../../schemas/comment.js";
import { CreateArticleBodySchema } from "../../schemas/create-article-body.js";
import { DeleteArticleCommentParamsSchema } from "../../schemas/delete-article-comment-params.js";
import { DeleteArticleParamsSchema } from "../../schemas/delete-article-params.js";
import { GenericErrorSchema } from "../../schemas/generic-error.js";
import { GetArticleCommentsParamsSchema } from "../../schemas/get-article-comments-params.js";
import { GetArticleParams } from "../../schemas/get-article-params.js";
import { GetArticlesFeedQuerystringSchema } from "../../schemas/get-articles-feed-querystring.js";
import { GetArticlesQuerystringSchema } from "../../schemas/get-articles-querystring.js";
import { UnfavoriteArticleParamsSchema } from "../../schemas/unfavorite-article-params.js";
import { UpdateArticleBodySchema } from "../../schemas/update-article-body.js";
import { UpdateArticleParamsSchema } from "../../schemas/update-article-params.js";
import { ValidationErrorSchema } from "../../schemas/validation-error.js";
import type { FastifyInstanceTypebox } from "../../types/fastify.js";
import { addArticleComment } from "../../use-cases/add-article-comment.js";
import { checkArticleComment } from "../../use-cases/check-article-comment.js";
import { checkArticle } from "../../use-cases/check-article.js";
import { createArticle } from "../../use-cases/create-article.js";
import { deleteArticleComment } from "../../use-cases/delete-article-comment.js";
import { deleteArticle } from "../../use-cases/delete-article.js";
import { favoriteArticle } from "../../use-cases/favorite-article.js";
import { getArticleComment } from "../../use-cases/get-article-comment.js";
import { getArticleComments } from "../../use-cases/get-article-comments.js";
import { getArticle } from "../../use-cases/get-article.js";
import { getArticlesFeed } from "../../use-cases/get-articles-feed.js";
import { getArticles } from "../../use-cases/get-articles.js";
import { unfavoriteArticle } from "../../use-cases/unfavorite-article.js";
import { updateArticle } from "../../use-cases/update-article.js";

export default async function (app: FastifyInstanceTypebox, _opts: unknown) {
  // Get recent articles globally
  app.route({
    method: "GET",
    url: "/articles",
    schema: {
      tags: ["Articles"],
      summary: "Get recent articles globally",
      description:
        "Get most recent articles globally. Use query parameters to filter results. Auth is optional",
      requestId: "GetArticles",
      querystring: GetArticlesQuerystringSchema,
      response: {
        200: Type.Object({
          articles: Type.Array(ArticleSchema),
          articlesCount: Type.String(),
        }),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowAnonymous, app.allowCredentials]) as any,
    async handler(req, reply) {
      return reply.status(200).send(await getArticles(app.kysely, req));
    },
  });

  app.route({
    method: "GET",
    url: "/articles/feed",
    schema: {
      tags: ["Articles"],
      summary: "Get recent articles from users you follow",
      description:
        "Get most recent articles from users you follow. Use query parameters to limit. Auth is required",
      requestId: "GetArticlesFeed",
      querystring: GetArticlesFeedQuerystringSchema,
      response: {
        200: Type.Object({
          articles: Type.Array(ArticleSchema),
          articlesCount: Type.String(),
        }),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      return reply.status(200).send(
        await getArticlesFeed(app.kysely, {
          jwt: req.jwt!,
          query: req.query,
        }),
      );
    },
  });

  // Create an article
  app.route({
    method: "POST",
    url: "/articles",
    schema: {
      tags: ["Articles"],
      summary: "Create an article",
      description: "Create an article. Auth is required",
      requestId: "CreateArticle",
      body: CreateArticleBodySchema,
      response: {
        201: Type.Object({
          article: ArticleSchema,
        }),
        400: ValidationErrorSchema,
        401: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      const created = await createArticle(app.kysely, {
        body: req.body,
        jwt: req.jwt!,
      });

      if (!created) {
        return reply.status(400).send({
          errors: {
            article: ["Could not create article"],
          },
        });
      }
      return reply.status(201).send({
        article: (await getArticle(app.kysely, {
          params: created,
          jwt: req.jwt!,
        }))!, // we know it exists because we just created it
      });
    },
  });

  // Get an article
  app.route({
    method: "GET",
    url: "/articles/:slug",
    schema: {
      tags: ["Articles"],
      summary: "Get an article",
      description: "Get an article. Auth is optional",
      requestId: "GetArticle",
      params: GetArticleParams,
      response: {
        200: Type.Object({
          article: ArticleSchema,
        }),
        404: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowAnonymous, app.allowCredentials]) as any,
    async handler(req, reply) {
      const article = await getArticle(app.kysely, req);
      if (!article) {
        return reply.status(404).send({
          message: "Article not found",
          status: "error",
        });
      }
      return reply.status(200).send({ article });
    },
  });

  // Update an article
  app.route({
    method: "PUT",
    url: "/articles/:slug",
    schema: {
      tags: ["Articles"],
      summary: "Update an article",
      description: "Update an article. Auth is required",
      requestId: "UpdateArticle",
      params: UpdateArticleParamsSchema,
      body: UpdateArticleBodySchema,
      response: {
        200: Type.Object({
          article: ArticleSchema,
        }),
        400: ValidationErrorSchema,
        401: GenericErrorSchema,
        404: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      if (!checkArticle(app.kysely, req)) {
        return reply.status(404).send({
          message: "Article not found",
          status: "error",
        });
      }

      await updateArticle(app.kysely, {
        jwt: req.jwt!, // jwt will exist because of preHandler
        params: req.params,
        body: req.body,
      });

      return reply.status(200).send({
        article: (await getArticle(app.kysely, req))!, // we know it exists because we just updated it
      });
    },
  });

  // Delete an article
  app.route({
    method: "DELETE",
    url: "/articles/:slug",
    schema: {
      tags: ["Articles"],
      summary: "Delete an article",
      description: "Delete an article. Auth is required",
      requestId: "DeleteArticle",
      params: DeleteArticleParamsSchema,
      response: {
        204: Type.Null(),
        401: GenericErrorSchema,
        404: GenericErrorSchema,
        500: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      if (!checkArticle(app.kysely, req)) {
        return reply.status(404).send({
          message: "Article not found",
          status: "error",
        });
      }

      if (
        await deleteArticle(app.kysely, {
          jwt: req.jwt!,
          params: req.params,
        })
      ) {
        return reply.status(204).send(null);
      }

      return reply.status(500).send({
        message: "Article could not be deleted",
        status: "error",
      });
    },
  });

  // Favorite an article
  app.route({
    method: "POST",
    url: "/articles/:slug/favorite",
    schema: {
      tags: ["Articles"],
      summary: "Favorite an article",
      description: "Favorite an article. Auth is required",
      requestId: "FavoriteArticle",
      params: Type.Object({
        slug: Type.String(),
      }),
      response: {
        200: Type.Object({
          article: ArticleSchema,
        }),
        401: GenericErrorSchema,
        404: GenericErrorSchema,
        500: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      if (!(await checkArticle(app.kysely, req))) {
        return reply.status(404).send({
          message: "Article not found",
          status: "error",
        });
      }

      await favoriteArticle(app.kysely, {
        // jwt will exist because of preHandler
        jwt: req.jwt!,
        params: req.params,
      });

      // we already check for existence of article above
      const article = (await getArticle(app.kysely, req))!;

      return reply.status(200).send({
        article,
      });
    },
  });

  // Unfavorite an article
  app.route({
    method: "DELETE",
    url: "/articles/:slug/favorite",
    schema: {
      tags: ["Articles"],
      summary: "Unfavorite an article",
      description: "Unfavorite an article. Auth is required",
      requestId: "UnfavoriteArticle",
      params: UnfavoriteArticleParamsSchema,
      response: {
        200: Type.Object({
          article: ArticleSchema,
        }),
        401: GenericErrorSchema,
        404: GenericErrorSchema,
        500: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      if (!(await checkArticle(app.kysely, req))) {
        return reply.status(404).send({
          message: "Article not found",
          status: "error",
        });
      }

      await unfavoriteArticle(app.kysely, {
        // jwt will exist because of preHandler
        jwt: req.jwt!,
        params: req.params,
      });

      // we already check for existence of article above
      const article = (await getArticle(app.kysely, req))!;

      return reply.status(200).send({
        article,
      });
    },
  });

  // Get comments from an article
  app.route({
    method: "GET",
    url: "/articles/:slug/comments",
    schema: {
      tags: ["Articles"],
      summary: "Get comments from an article",
      description: "Get comments for an article. Auth is optional",
      requestId: "GetArticleComments",
      params: GetArticleCommentsParamsSchema,
      response: {
        200: Type.Object({
          comments: Type.Array(CommentSchema),
        }),
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowAnonymous, app.allowCredentials]) as any,
    async handler(req, reply) {
      return reply.status(200).send({
        comments: await getArticleComments(app.kysely, req),
      });
    },
  });

  // Add comments to an article
  app.route({
    method: "POST",
    url: "/articles/:slug/comments",
    schema: {
      tags: ["Articles"],
      summary: "Add comments to an article",
      description: "Add a comment to an article. Auth is required",
      requestId: "AddArticleComment",
      params: AddArticleCommentParamsSchema,
      body: AddArticleCommentBodySchema,
      response: {
        200: Type.Object({
          comment: CommentSchema,
        }),
        400: ValidationErrorSchema,
        401: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      const added = await addArticleComment(app.kysely, {
        params: req.params,
        body: req.body,
        jwt: req.jwt!,
      });

      if (!added) {
        return reply.status(400).send({
          errors: {
            comment: ["Could not add comment"],
          },
        });
      }

      // we know it exists because we just created it
      const comment = (await getArticleComment(app.kysely, {
        params: {
          id: added.id,
          slug: req.params.slug,
        },
        jwt: req.jwt!,
      }))!;

      return reply.status(200).send({
        comment,
      });
    },
  });

  // Delete comment
  app.route({
    method: "DELETE",
    url: "/articles/:slug/comments/:id",
    schema: {
      tags: ["Articles"],
      summary: "Delete comment",
      description: "Delete a comment for an article. Auth is required",
      requestId: "DeleteArticleComment",
      params: DeleteArticleCommentParamsSchema,
      response: {
        200: Type.Object({}),
        400: ValidationErrorSchema,
        401: GenericErrorSchema,
        404: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      if (!(await checkArticleComment(app.kysely, req))) {
        return reply.status(404).send({
          message: "Comment not found",
          status: "error",
        });
      }

      if (
        !(await deleteArticleComment(app.kysely, {
          params: req.params,
          jwt: req.jwt!,
        }))
      ) {
        return reply.status(400).send({
          errors: {
            comment: ["Could not delete comment"],
          },
        });
      }

      return reply.status(200).send({});
    },
  });
}
