import jwt from "jsonwebtoken";
import { User } from "../core/models/user.model";

export function generateToken(user: User) {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }

    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error('ACCESS_TOKEN_SECRET is not defined');
        }

        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as User;
    } catch (error) {
        throw new Error('Invalid token');
    }
}