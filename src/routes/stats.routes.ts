import { Router } from "express";
import { StatsController } from "../infra/http/controllers/stats.controller";
import { authMiddleware } from "../core/middleware/auth.middleware";

export const statsRoutes = Router();
const controller = new StatsController();

// Protected routes (Only admins should see stats, but for now we'll allow all authenticated users)
statsRoutes.use(authMiddleware);
statsRoutes.get("/dashboard", controller.getDashboardStats);
