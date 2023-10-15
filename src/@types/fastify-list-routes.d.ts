declare module "fastify-list-routes" {
  import type { FastifyPluginCallback } from "fastify";
  type FastifyListRoutesPlugin = FastifyPluginCallback<{
    /**
     * If set to true, the output will be colored.
     * @default false
     */
    colors?: boolean;
  }>;

  declare function fastifyListRoutes(
    ...params: Parameters<FastifyListRoutesPlugin>
  ): ReturnType<FastifyListRoutesPlugin>;

  export = fastifyListRoutes;
}
