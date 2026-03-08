"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_token_provider_1 = require("../../infra/providers/implementations/jwt-token.provider");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token not provided" });
    }
    const [, token] = authHeader.split(" ");
    const tokenProvider = new jwt_token_provider_1.JwtTokenProvider();
    try {
        const decoded = tokenProvider.verifyToken(token);
        req.user = decoded; // Attach user payload to request
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
