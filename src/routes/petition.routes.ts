import { Router } from "express";
import { PetitionController } from "../infra/http/controllers/petition.controller";
import { authMiddleware } from "../core/middleware/auth.middleware";

export const petitionRoutes = Router();
const controller = new PetitionController();

// Public routes
petitionRoutes.get("/", (req, res) => controller.list(req, res));
petitionRoutes.get("/:id", (req, res) => controller.getById(req, res));
petitionRoutes.get("/:id/analytics", (req, res) => controller.getAnalytics(req, res));

// Protected routes
petitionRoutes.use(authMiddleware);
petitionRoutes.get("/petitions/mine", (req, res) => controller.listMine(req, res));
petitionRoutes.post("/", (req, res) => controller.create(req, res));
petitionRoutes.put("/:id", (req, res) => controller.update(req, res));
petitionRoutes.post("/:id/sign", (req, res) => controller.sign(req, res));

