import { Router } from "express";
import { PetitionController } from "../infra/http/controllers/petition.controller";
import { authMiddleware } from "../core/middleware/auth.middleware";

export const petitionRoutes = Router();
const controller = new PetitionController();

// Public routes
petitionRoutes.get("/", controller.list);
petitionRoutes.get("/:id/analytics", controller.getAnalytics);
petitionRoutes.get("/:id", controller.getById);

// Protected routes — /my must come before /:id to avoid collision
petitionRoutes.use(authMiddleware);
petitionRoutes.get("/my", controller.listMine);
petitionRoutes.post("/", controller.create);
petitionRoutes.post("/:id/sign", controller.sign);

