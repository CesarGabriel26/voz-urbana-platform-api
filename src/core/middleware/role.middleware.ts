import { Request, Response, NextFunction } from "express";

export enum Role {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER"
}

export function requireRole(...roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {

        const userRole = (req as any).user.role;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: "Você não tem permissão para essa ação"
            });
        }

        next();
    };
}