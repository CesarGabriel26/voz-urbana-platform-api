import { Router } from "express";
import { ComplaintController } from "../infra/http/controllers/complaint.controller";
import { authMiddleware } from "../core/middleware/auth.middleware";

export const complaintRoutes = Router();
const controller = new ComplaintController();

complaintRoutes.get("/", controller.list);
complaintRoutes.get("/:id", controller.getById);

// Protected routes
complaintRoutes.use(authMiddleware);
complaintRoutes.post("/", controller.create);
complaintRoutes.put("/:id", controller.update);
complaintRoutes.delete("/:id", controller.delete);
complaintRoutes.post("/:id/vote", controller.vote);
