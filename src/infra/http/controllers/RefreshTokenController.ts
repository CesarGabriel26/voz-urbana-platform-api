import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../core/usecases/user/RefreshTokenUseCase";

export class RefreshTokenController {
    constructor(private refreshTokenUseCase: RefreshTokenUseCase) { }

    async handle(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            const result = await this.refreshTokenUseCase.execute(refreshToken);

            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message || "Erro ao atualizar token" });
        }
    }
}
