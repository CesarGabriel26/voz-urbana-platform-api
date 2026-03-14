import { IMessageRepository } from "../../repositories/message-repository.interface";
import { Message } from "../../models/message.model";

export class UpdateMessageUseCase {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(id: string, userId: string, data: Partial<Message>) {
        const messages = await this.messageRepository.findByUserId(userId);
        const message = messages.find(m => m.id === id);

        if (!message) {
            throw new Error("Message not found or access denied");
        }

        return this.messageRepository.update(id, data);
    }
}
