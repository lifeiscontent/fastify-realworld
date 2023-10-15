import type { FastifyAuthFunction } from "@fastify/auth";
import auth from "@fastify/auth";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import ajvErrors from "ajv-errors";
import Fastify from "fastify";
import fastifyListRoutes from "fastify-list-routes";
import { PostgresDialect } from "kysely";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import kysely from "./plugins/kysely.js";
import type { JwtToken } from "./schemas/jwt-token.js";
import { getJwtToken } from "./utils/token.js";

function createApp() {
  if (process.env.NODE_ENV === "development") {
    return Fastify({
      logger: true,
      ajv: {
        customOptions: {
          allErrors: true,
        },
        plugins: [ajvErrors],
      },
    }).register(fastifyListRoutes, { colors: true });
  }

  return Fastify({
    logger: process.env.NODE_ENV === "production",
    ajv: {
      customOptions: {
        allErrors: true,
      },
      plugins: [ajvErrors],
    },
  });
}

const app = createApp()
  .register(kysely, {
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  })
  .withTypeProvider<TypeBoxTypeProvider>()
  .setErrorHandler((error, _req, reply) => {
    if (error.validation) {
      const validationErrors: Record<string, string[]> = {};
      error.validation.forEach((err) => {
        const key = err.instancePath.substring(1); // Remove the leading dot
        validationErrors[key] = [err.message!];
      });
      reply.status(400).send({ errors: validationErrors });
    } else {
      reply.send(error);
    }
  })
  .decorate("allowAnonymous", (req, _reply, done) => {
    if (req.headers.authorization) {
      return done(Error("not anonymous"));
    }
    return done();
  })
  .decorate("allowCredentials", (req, reply, done) => {
    if (!req.headers.authorization) {
      reply.status(401).send({
        status: "error",
        message: "missing authorization credentials",
      });

      return done(new Error("missing authorization credentials"));
    }

    const [type, token] = req.headers.authorization.split(" ");

    if (type !== "Bearer") {
      reply.status(401).send({
        status: "error",
        message: "missing authorization credentials",
      });

      return done(new Error("missing authorization credentials"));
    }

    const decoded = getJwtToken(token);

    if (!decoded) {
      reply.status(401).send({
        status: "error",
        message: "missing authorization credentials",
      });

      return done(new Error("missing authorization credentials"));
    }

    req.jwt = decoded;
    return done();
  })
  .register(cors)
  .register(swagger, {
    openapi: {
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
    },
  })
  .register(swaggerUi)
  .register(auth)
  .register(autoload, {
    ignorePattern: /^.*test.(?:js|ts)$/,
    dir: join(dirname(fileURLToPath(import.meta.url)), "routes"),
  });

declare module "fastify" {
  interface FastifyInstance {
    allowAnonymous: FastifyAuthFunction;
    allowCredentials: FastifyAuthFunction;
  }

  interface FastifyRequest {
    jwt?: JwtToken;
  }
}

export default app;
