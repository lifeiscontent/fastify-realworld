import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    restoreMocks: true,
    coverage: {
      include: ["src/**/*.*"],
      exclude: ["src/migrations", "src/@types"],
      all: true,
    },
    setupFiles: ["tests/setup/test-env.ts"],
    globalSetup: "tests/setup/global.ts",

    env: {
      NODE_ENV: "test",
      TZ: "UTC",
    },
    server: {
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
  },
});
