import { Message } from "../models/message.model";

export interface IMessageRepository {
    create(data: Omit<Message, "id" | "created_at" | "updated_at">): Promise<Message>;
    findByUserId(id: string): Promise<Message[]>;
    findAll(filters?: any): Promise<Message[]>;
    update(id: string, data: Partial<Message>): Promise<Message>;
    delete(id: string): Promise<void>;
}
