"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const user_schema_1 = require("../../schemas/user.schema");
class LoginController {
    loginUseCase;
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }
    async handle(req, res) {
        try {
            const data = user_schema_1.loginRequestSchema.parse(req.body);
            const result = await this.loginUseCase.execute(data);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ message: error.message || "Erro de autenticação" });
        }
    }
}
exports.LoginController = LoginController;
