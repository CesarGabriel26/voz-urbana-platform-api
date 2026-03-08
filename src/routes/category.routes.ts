import { Router } from "express";
import { CategoryController } from "../infra/http/controllers/category.controller";
import { authMiddleware } from "../core/middleware/auth.middleware";
import { Role, roleMiddleware } from "../core/middleware/role.middleware";

export const categoryRoutes = Router();
const controller = new CategoryController();

categoryRoutes.get("/", controller.list);
categoryRoutes.get("/:id", controller.getById);

// Protected routes
categoryRoutes.use(authMiddleware, roleMiddleware(Role.ADMIN));
categoryRoutes.post("/", controller.create);
categoryRoutes.put("/:id", controller.update);
categoryRoutes.delete("/:id", controller.delete);
