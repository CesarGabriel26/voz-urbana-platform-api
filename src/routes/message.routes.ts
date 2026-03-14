import { Router } from "express";
import { MessageController } from "../infra/http/controllers/message.controller";
import { authMiddleware } from "../core/middleware/auth.middleware";

export const messageRoutes = Router();
const controller = new MessageController();

messageRoutes.use(authMiddleware);

messageRoutes.get("/", controller.list);
messageRoutes.patch("/:id", controller.update);
messageRoutes.delete("/:id", controller.delete);
