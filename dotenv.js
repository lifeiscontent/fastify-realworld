import dotenv from "dotenv";
import path from "node:path";

const FILE = ".env";
const LOCAL = "local";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), [FILE, LOCAL].join(".")) });

if (process.env.NODE_ENV) {
  dotenv.config({
    path: path.resolve(process.cwd(), [FILE, process.env.NODE_ENV].join(".")),
  });

  dotenv.config({
    path: path.resolve(
      process.cwd(),
      [FILE, process.env.NODE_ENV, LOCAL].join("."),
    ),
  });
}
