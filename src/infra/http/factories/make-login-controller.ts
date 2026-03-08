import { BcryptHashProvider } from "../../providers/implementations/bcrypt-hash.provider";
import { PrismaUserRepository } from "../../database/repositories/user.repository";
import { LoginUserUseCase } from "../../../core/usecases/user/LoginUserUseCase";
import { LoginController } from "../controllers/auth.controller";
import { JwtTokenProvider } from "../../providers/implementations/jwt-token.provider";

export function makeLoginController() {
    // Instancia os provedores (Infra)
    const userRepository = new PrismaUserRepository(); // Implementação real do banco
    const hashProvider = new BcryptHashProvider();
    const tokenProvider = new JwtTokenProvider();

    // Instancia o Use Case com as dependências
    const loginUseCase = new LoginUserUseCase(userRepository, hashProvider, tokenProvider);

    // Retorna o Controller
    return new LoginController(loginUseCase);
}
