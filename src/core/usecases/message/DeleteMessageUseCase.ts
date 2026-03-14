import { IMessageRepository } from "../../repositories/message-repository.interface";

export class DeleteMessageUseCase {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(id: string, userId: string) {
        const messages = await this.messageRepository.findByUserId(userId);
        const message = messages.find(m => m.id === id);

        if (!message) {
            throw new Error("Message not found or access denied");
        }

        return this.messageRepository.delete(id);
    }
}
