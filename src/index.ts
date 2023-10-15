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
