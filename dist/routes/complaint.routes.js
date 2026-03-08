"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintRoutes = void 0;
const express_1 = require("express");
const complaint_controller_1 = require("../infra/http/controllers/complaint.controller");
const auth_middleware_1 = require("../core/middleware/auth.middleware");
exports.complaintRoutes = (0, express_1.Router)();
const controller = new complaint_controller_1.ComplaintController();
exports.complaintRoutes.get("/", controller.list);
exports.complaintRoutes.get("/:id", controller.getById);
// Protected routes
exports.complaintRoutes.use(auth_middleware_1.authMiddleware);
exports.complaintRoutes.post("/", controller.create);
exports.complaintRoutes.put("/:id", controller.update);
exports.complaintRoutes.delete("/:id", controller.delete);
exports.complaintRoutes.post("/:id/vote", controller.vote);
