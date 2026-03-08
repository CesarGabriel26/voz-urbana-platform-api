"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginController = makeLoginController;
const bcrypt_hash_provider_1 = require("../../providers/implementations/bcrypt-hash.provider");
const prisma_user_repository_1 = require("../../database/repositories/prisma-user.repository");
const LoginUserUseCase_1 = require("../../../core/usecases/user/LoginUserUseCase");
const auth_controller_1 = require("../controllers/auth.controller");
const jwt_token_provider_1 = require("../../providers/implementations/jwt-token.provider");
function makeLoginController() {
    // Instancia os provedores (Infra)
    const userRepository = new prisma_user_repository_1.PrismaUserRepository(); // Implementação real do banco
    const hashProvider = new bcrypt_hash_provider_1.BcryptHashProvider();
    const tokenProvider = new jwt_token_provider_1.JwtTokenProvider();
    // Instancia o Use Case com as dependências
    const loginUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository, hashProvider, tokenProvider);
    // Retorna o Controller
    return new auth_controller_1.LoginController(loginUseCase);
}
