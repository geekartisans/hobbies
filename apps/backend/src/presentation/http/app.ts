import cors from "cors";
import express, { Express } from "express";
import pinoHttp from "pino-http";
import type { Logger } from "pino";
import { UserController } from "./controllers/user.controller";
import { createUserRouter } from "./routes/user.routes";
import { errorHandler } from "./middleware/error-handler";
import { createHobbiesRouter } from "./routes/hobbies.routes";
import { HobbiesController } from "./controllers/hobbies.controller";
import { StatusCodes } from "http-status-codes";
import { mountFrontend } from "@infrastructure/http/serve-frontend";

export const createApp = async (
  userController: UserController,
  hobbiesController: HobbiesController,
  logger: Logger,
): Promise<Express> => {
  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(cors({ origin: process.env.APP_ORIGIN }));
  app.use(express.json());

  app.use("/api/users", createUserRouter(userController));
  app.use("/api/hobbies", createHobbiesRouter(hobbiesController));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.all("/api/{*path}", (_req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ error: "Not found" });
  });

  await mountFrontend(app, logger);

  app.use(errorHandler);

  return app;
};
