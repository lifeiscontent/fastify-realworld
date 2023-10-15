import { Type } from "@sinclair/typebox";
import type { FastifyInstanceTypebox } from "../../types/fastify.js";
import { getTags } from "../../use-cases/get-tags.js";

export default async function (app: FastifyInstanceTypebox, _opts: unknown) {
  app.route({
    method: "GET",
    url: "/tags",
    schema: {
      tags: ["Tags"],
      summary: "Get tags",
      description: "Get all tags",
      requestId: "GetTags",
      response: {
        200: Type.Object({
          tags: Type.Array(Type.String()),
        }),
      },
    },
    async handler(_req, reply) {
      return reply.status(200).send({
        tags: await getTags(app.kysely),
      });
    },
  });
}
