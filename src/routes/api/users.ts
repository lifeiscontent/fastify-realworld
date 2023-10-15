import { Type } from "@sinclair/typebox";
import { CreateUserBodySchema } from "../../schemas/create-user-body.js";
import { LoginBodySchema } from "../../schemas/login-body.js";
import { UserSchema } from "../../schemas/user.js";
import { ValidationErrorSchema } from "../../schemas/validation-error.js";
import type { FastifyInstanceTypebox } from "../../types/fastify.js";
import { createUser } from "../../use-cases/create-user.js";
import { login } from "../../use-cases/login.js";

export default async function (app: FastifyInstanceTypebox, _opts: unknown) {
  // Login endpoint
  app.route({
    method: "POST",
    url: "/users/login",
    schema: {
      tags: ["User and Authentication"],
      summary: "Existing user login",
      description: "Login for existing user",
      requestId: "Login",
      body: LoginBodySchema,
      response: {
        200: Type.Object({
          user: UserSchema,
        }),
        400: ValidationErrorSchema,
      },
    },
    async handler(req, reply) {
      const user = await login(app.kysely, req);
      if (!user) {
        return reply.status(400).send({
          errors: {
            body: ["Invalid email or password"],
          },
        });
      }

      return reply.status(200).send({
        user,
      });
    },
  });

  // Register new user endpoint
  app.route({
    method: "POST",
    url: "/users",
    schema: {
      tags: ["User and Authentication"],
      description: "Register a new user",
      requestId: "CreateUser",
      body: CreateUserBodySchema,
      response: {
        200: Type.Object({
          user: UserSchema,
        }),
        400: ValidationErrorSchema,
      },
    },
    async handler(req, reply) {
      const user = await createUser(app.kysely, req);

      return reply.status(200).send({
        user,
      });
    },
  });
}
