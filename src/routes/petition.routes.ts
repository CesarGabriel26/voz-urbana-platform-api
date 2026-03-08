import { Router } from "express";
import { PetitionController } from "../infra/http/controllers/petition.controller";
import { authMiddleware } from "../core/middleware/auth.middleware";

export const petitionRoutes = Router();
const controller = new PetitionController();

petitionRoutes.get("/", controller.list);
petitionRoutes.get("/:id", controller.getById);
petitionRoutes.get("/:id/analytics", controller.getAnalytics);

// Protected routes
petitionRoutes.use(authMiddleware);
petitionRoutes.post("/", controller.create);
petitionRoutes.post("/:id/sign", controller.sign);
