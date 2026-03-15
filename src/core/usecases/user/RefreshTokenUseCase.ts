import { IUserRepository } from "../../repositories/user-repository.interface";
import { ITokenProvider } from "../../../infra/providers/token-provider.interface";

export class RefreshTokenUseCase {
    constructor(
        private userRepository: IUserRepository,
        private tokenProvider: ITokenProvider
    ) { }

    async execute(refreshToken: string) {
        if (!refreshToken) {
            throw new Error("Refresh token não fornecido");
        }

        try {
            // 1. Verificar o token
            const decoded = this.tokenProvider.verifyToken(refreshToken);
            const userId = decoded.sub;

            // 2. Buscar o usuário e validar se o refresh token é o mesmo salvo no banco
            const user = await this.userRepository.findById(userId);

            if (!user || user.refreshToken !== refreshToken) {
                throw new Error("Token de atualização inválido");
            }

            // 3. Gerar novo Access Token
            const accessToken = this.tokenProvider.generateAccessToken({
                sub: user.id,
                role: user.role
            });

            // 4. Gerar novo Refresh Token (Opcional: Refresh token rotation)
            const newRefreshToken = this.tokenProvider.generateRefreshToken(user.id);
            await this.userRepository.updateRefreshToken(user.id, newRefreshToken);

            return {
                accessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            throw new Error("Token de atualização inválido ou expirado");
        }
    }
}
