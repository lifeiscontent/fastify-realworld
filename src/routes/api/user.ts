import { Type } from "@sinclair/typebox";
import { GenericErrorSchema } from "../../schemas/generic-error.js";
import { UpdateCurrentUserBody } from "../../schemas/user-current-user-body.js";
import { UserSchema } from "../../schemas/user.js";
import { ValidationErrorSchema } from "../../schemas/validation-error.js";
import type { FastifyInstanceTypebox } from "../../types/fastify.js";
import { getCurrentUser } from "../../use-cases/get-current-user.js";
import { updateCurrentUser } from "../../use-cases/update-current-user.js";

export default async function (app: FastifyInstanceTypebox, _opts: unknown) {
  // Get current user endpoint
  app.route({
    method: "GET",
    url: "/user",
    schema: {
      tags: ["User and Authentication"],
      summary: "Get current user",
      description: "Gets the currently logged-in user. Auth is required",
      requestId: "GetCurrentUser",
      response: {
        200: Type.Object({
          user: UserSchema,
        }),
        401: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      const user = (await getCurrentUser(app.kysely, {
        jwt: req.jwt!,
      }))!; // user should be defined here
      return reply.status(200).send({
        user,
      });
    },
  });

  // Update current user endpoint
  app.route({
    method: "PUT",
    url: "/user",
    schema: {
      tags: ["User and Authentication"],
      summary: "Update current user",
      description: "Update user information for current user. Auth is required",
      requestId: "UpdateCurrentUser",
      body: UpdateCurrentUserBody,
      response: {
        200: Type.Object({
          user: UserSchema,
        }),
        400: ValidationErrorSchema,
        401: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      await updateCurrentUser(app.kysely, {
        jwt: req.jwt!,
        body: req.body,
      });

      const user = (await getCurrentUser(app.kysely, {
        jwt: req.jwt!,
      }))!; // user should be defined here

      return reply.status(200).send({
        user,
      });
    },
  });
}
