import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export function createUserRouter(controller: UserController): Router {
  const router = Router();

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.delete("/:id", controller.remove);

  return router;
}
