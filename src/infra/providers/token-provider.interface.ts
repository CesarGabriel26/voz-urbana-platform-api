export interface ITokenProvider {
    generateAccessToken(payload: any): string;
    generateRefreshToken(userId: string): string;
    verifyToken(token: string): any;
    hashCPF(cpf: string): string;
}