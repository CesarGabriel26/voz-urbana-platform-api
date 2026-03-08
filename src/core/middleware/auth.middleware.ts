import { Request, Response, NextFunction } from "express";
import { JwtTokenProvider } from "../../infra/providers/implementations/jwt-token.provider";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const [, token] = authHeader.split(" ");
  const tokenProvider = new JwtTokenProvider();

  try {
    const decoded = tokenProvider.verifyToken(token);
    (req as any).user = decoded; // Attach user payload to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
