import { Type } from "@sinclair/typebox";
import { FollowUserByUsernameParamsSchema } from "../../schemas/follow-user-by-username-params.js";
import { GenericErrorSchema } from "../../schemas/generic-error.js";
import { GetProfileByUsernameParamsSchema } from "../../schemas/get-profile-by-username-params.js";
import { ProfileSchema } from "../../schemas/profile.js";
import { UnfollowUserByUsernameParamsSchema } from "../../schemas/unfollow-user-by-username-params.js";
import type { FastifyInstanceTypebox } from "../../types/fastify.js";
import { checkUser } from "../../use-cases/check-user.js";
import { followUserByUsername } from "../../use-cases/follow-user-by-username.js";
import { getProfileByUsername } from "../../use-cases/get-profile-by-username.js";
import { unfollowUserByUsername } from "../../use-cases/unfollow-user-by-username.js";

export default async function (app: FastifyInstanceTypebox, _opts: unknown) {
  // Get a profile
  app.route({
    method: "GET",
    url: "/profiles/:username",
    schema: {
      tags: ["Profile"],
      summary: "Get a profile",
      description: "Get a profile of a user of the system. Auth is optional",
      requestId: "GetProfileByUsername",
      params: GetProfileByUsernameParamsSchema,
      response: {
        200: Type.Object({
          profile: ProfileSchema,
        }),
        404: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowAnonymous, app.allowCredentials]) as any,
    async handler(req, reply) {
      const profile = await getProfileByUsername(app.kysely, req);
      if (!profile) {
        return reply.status(404).send({
          message: "Profile not found",
          status: "error",
        });
      }
      return reply.status(200).send({
        profile,
      });
    },
  });

  // Follow a user
  app.route({
    method: "POST",
    url: "/profiles/:username/follow",
    schema: {
      tags: ["Profile"],
      summary: "Follow a user",
      description: "Follow a user by username. Auth is required",
      requestId: "FollowUserByUsername",
      params: FollowUserByUsernameParamsSchema,
      response: {
        200: Type.Object({
          profile: ProfileSchema,
        }),
        401: GenericErrorSchema,
        404: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      if (!(await checkUser(app.kysely, req))) {
        return reply.status(404).send({
          message: "Profile not found",
          status: "error",
        });
      }

      await followUserByUsername(app.kysely, {
        params: req.params,
        jwt: req.jwt!,
      });

      const profile = (await getProfileByUsername(app.kysely, req))!;

      return reply.status(200).send({
        profile,
      });
    },
  });

  // Unfollow a user
  app.route({
    method: "DELETE",
    url: "/profiles/:username/follow",
    schema: {
      tags: ["Profile"],
      summary: "Unfollow a user",
      description: "Unfollow a user by username. Auth is required",
      requestId: "UnfollowUserByUsername",
      params: UnfollowUserByUsernameParamsSchema,
      response: {
        200: Type.Object({
          profile: ProfileSchema,
        }),
        401: GenericErrorSchema,
        404: GenericErrorSchema,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preHandler: app.auth([app.allowCredentials]) as any,
    async handler(req, reply) {
      if (!(await checkUser(app.kysely, req))) {
        return reply.status(404).send({
          message: "Profile not found",
          status: "error",
        });
      }

      await unfollowUserByUsername(app.kysely, {
        params: req.params,
        jwt: req.jwt!,
      });

      const profile = (await getProfileByUsername(app.kysely, req))!;

      return reply.status(200).send({
        profile,
      });
    },
  });
}
