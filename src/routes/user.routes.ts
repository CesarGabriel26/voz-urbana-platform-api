import { Router } from "express";
import { UserController } from "../infra/http/controllers/user.controller";
import { makeLoginController } from "../infra/http/factories/make-login-controller";
import { authMiddleware } from "../core/middleware/auth.middleware";

import { makeRefreshTokenController } from "../infra/http/factories/make-refresh-token-controller";

export const userRoutes = Router();
const userController = new UserController();
const loginController = makeLoginController();
const refreshTokenController = makeRefreshTokenController();

userRoutes.post("/signup", userController.create);

userRoutes.post("/login", (req, res) => loginController.handle(req, res));
userRoutes.post("/refresh", (req, res) => refreshTokenController.handle(req, res));

userRoutes.put("/", authMiddleware, userController.update);
userRoutes.post("/push/subscribe", authMiddleware, userController.savePushSubscription);
userRoutes.post("/push/unsubscribe", authMiddleware, userController.removePushSubscription);
userRoutes.put("/notification-settings", authMiddleware, userController.updateNotificationSettings);
