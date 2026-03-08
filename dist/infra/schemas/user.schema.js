"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequestSchema = void 0;
const zod_1 = require("zod");
exports.loginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email("Formato de e-mail inválido"),
    password: zod_1.z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});
