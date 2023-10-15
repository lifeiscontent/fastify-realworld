import { afterAll } from "vitest";
import app from "../../src/app.js";

afterAll(async () => {
  await app.close();
});
