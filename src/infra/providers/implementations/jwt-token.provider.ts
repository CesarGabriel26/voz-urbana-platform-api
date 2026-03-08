import { ITokenProvider } from "../token-provider.interface";
import * as jwt from "jsonwebtoken";

export class JwtTokenProvider implements ITokenProvider {
  private readonly secret = process.env.JWT_SECRET || "default_secret";

  generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1d" });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ sub: userId }, this.secret, { expiresIn: "7d" });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
