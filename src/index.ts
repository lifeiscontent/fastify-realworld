import path from "node:path";
import dotenv from "dotenv";

const FILE = ".env";
const ENVIRONMENT = process.env.NODE_ENV;
const LOCAL = "local";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), [FILE, LOCAL].join(".")) });

if (ENVIRONMENT) {
  dotenv.config({
    path: path.resolve(process.cwd(), [FILE, ENVIRONMENT].join(".")),
  });
  dotenv.config({
    path: path.resolve(process.cwd(), [FILE, ENVIRONMENT, LOCAL].join(".")),
  });
}

export async function main() {
  // this is needed so the `.env` files load before the app is imported
  const app = (await import("./app.js")).default;
  try {
    app.listen({ port: 3000 }, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, async () => {
      app.log.info({ signal }, "closing application");

      try {
        await app.close();
        app.log.info({ signal }, "application closed");
        process.exit(0);
      } catch (err) {
        app.log.error({ err }, "error closing the application");
        process.exit(1);
      }
    });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
