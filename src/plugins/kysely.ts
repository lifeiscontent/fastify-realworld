import { FastifyPluginCallbackTypebox } from "@fastify/type-provider-typebox";
import fp from "fastify-plugin";
import { Kysely, KyselyConfig } from "kysely";
import { DB } from "kysely-codegen";

const kyselyPlugin: FastifyPluginCallbackTypebox<KyselyConfig> = (
  fastify,
  options,
  done,
) => {
  if (!fastify.kysely) {
    const kysely = new Kysely<DB>(options);
    fastify.decorate("kysely", kysely);

    fastify.addHook("onClose", (fastify, done) => {
      if (fastify.kysely === kysely) {
        fastify.kysely.destroy().then(
          () => done(),
          () => done(),
        );
      }
    });
  }

  done();
};

declare module "fastify" {
  interface FastifyInstance {
    kysely: Kysely<DB>;
  }
}

export default fp(kyselyPlugin, { name: "fastify-knex-example" });
