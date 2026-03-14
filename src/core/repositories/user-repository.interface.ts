import { User } from "../models/user.model";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
  savePushSubscription(userId: string, subscription: any): Promise<void>;
  removePushSubscription(userId: string, endpoint: string): Promise<void>;
  updateNotificationSettings(userId: string, settings: any): Promise<void>;
}
