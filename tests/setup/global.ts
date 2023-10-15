import dotenv from "dotenv";
import path from "path";

export default function () {
  const FILE = ".env";
  const ENVIRONMENT = process.env.NODE_ENV;
  const LOCAL = "local";

  dotenv.config();
  dotenv.config({
    path: path.resolve(process.cwd(), [FILE, LOCAL].join(".")),
  });

  if (ENVIRONMENT) {
    dotenv.config({
      path: path.resolve(process.cwd(), [FILE, ENVIRONMENT].join(".")),
    });
    dotenv.config({
      path: path.resolve(process.cwd(), [FILE, ENVIRONMENT, LOCAL].join(".")),
    });
  }
}
