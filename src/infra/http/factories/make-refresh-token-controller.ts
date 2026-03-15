import { PrismaUserRepository } from "../../database/repositories/user.repository";
import { JwtTokenProvider } from "../../providers/implementations/jwt-token.provider";
import { RefreshTokenUseCase } from "../../../core/usecases/user/RefreshTokenUseCase";
import { RefreshTokenController } from "../controllers/RefreshTokenController";

export function makeRefreshTokenController(): RefreshTokenController {
    const userRepository = new PrismaUserRepository();
    const tokenProvider = new JwtTokenProvider();
    const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, tokenProvider);

    return new RefreshTokenController(refreshTokenUseCase);
}
