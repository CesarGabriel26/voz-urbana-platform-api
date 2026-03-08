import { ITokenProvider } from "../token-provider.interface";
import * as jwt from "jsonwebtoken";
import * as crypto from "crypto";

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

  hashCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');

    const salt = process.env.CPF_SALT || '12345678901234567890123456789012';

    return crypto.createHmac('sha256', salt)
      .update(cleanCPF)
      .digest('hex');
  }
}
