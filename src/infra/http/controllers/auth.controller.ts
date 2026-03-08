// src/infra/http/controllers/login.controller.ts
import { Request, Response } from "express";
import { loginRequestSchema } from "../../schemas/user.schema";
import { LoginUserUseCase } from "../../../core/usecases/user/LoginUserUseCase";

export class LoginController {
    constructor(private loginUseCase: LoginUserUseCase) { }

    async handle(req: Request, res: Response) {
        try {
            const data = loginRequestSchema.parse(req.body);

            const result = await this.loginUseCase.execute(data);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message || "Erro de autenticação" });
        }
    }
}
