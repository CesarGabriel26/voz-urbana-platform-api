// src/core/use-cases/auth/login-user.use-case.ts
import { IHashProvider } from "../../../infra/providers/hash-provider.interface";
import { ITokenProvider } from "../../../infra/providers/token-provider.interface";
import { LoginRequestDTO } from "../../../infra/schemas/user.schema";
import { IUserRepository } from "../../repositories/user-repository.interface";

export class LoginUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private hashProvider: IHashProvider,
        private tokenProvider: ITokenProvider
    ) { }


    async execute({ cpf, password }: LoginRequestDTO) {
        // 1. Verificar se o usuário existe
        const user = await this.userRepository.findByCpf(cpf);
        if (!user) {
            throw new Error("Credenciais inválidas"); // Erro genérico por segurança
        }
        // 2. Comparar a senha (Hash)
        const passwordMatch = await this.hashProvider.compare(password, user.password || "");

        if (!passwordMatch) {
            throw new Error("Credenciais inválidas");
        }

        // 3. Gerar Access Token (curta duração, ex: 15min)
        const accessToken = this.tokenProvider.generateAccessToken({
            sub: user.id,
            role: user.role // opcional: se tiver roles
        });

        // 4. Gerar Refresh Token (longa duração, ex: 7 dias)
        // Dica: O Refresh Token deve ser salvo no Banco (ou Redis) para controle de revogação
        const refreshToken = this.tokenProvider.generateRefreshToken(user.id);

        await this.userRepository.updateRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            accessToken,
            refreshToken
        };
    }
}
