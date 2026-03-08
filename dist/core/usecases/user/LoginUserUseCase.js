"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
class LoginUserUseCase {
    userRepository;
    hashProvider;
    tokenProvider;
    constructor(userRepository, hashProvider, tokenProvider) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
        this.tokenProvider = tokenProvider;
    }
    async execute({ email, password }) {
        // 1. Verificar se o usuário existe
        const user = await this.userRepository.findByEmail(email);
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
exports.LoginUserUseCase = LoginUserUseCase;
