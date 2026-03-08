"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petitionRoutes = void 0;
const express_1 = require("express");
const petition_controller_1 = require("../infra/http/controllers/petition.controller");
const auth_middleware_1 = require("../core/middleware/auth.middleware");
exports.petitionRoutes = (0, express_1.Router)();
const controller = new petition_controller_1.PetitionController();
exports.petitionRoutes.get("/", controller.list);
exports.petitionRoutes.get("/:id", controller.getById);
exports.petitionRoutes.get("/:id/analytics", controller.getAnalytics);
// Protected routes
exports.petitionRoutes.use(auth_middleware_1.authMiddleware);
exports.petitionRoutes.post("/", controller.create);
exports.petitionRoutes.post("/:id/sign", controller.sign);
