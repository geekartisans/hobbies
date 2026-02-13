import { Router } from "express";
import { HobbiesController } from "../controllers/hobbies.controller";

export function createHobbiesRouter(controller: HobbiesController): Router {
  const router = Router();

  router.post("/", controller.create);

  return router;
}
