import { IMessageRepository } from "../../repositories/message-repository.interface";

export class ListMessagesUseCase {
    constructor(private messageRepository: IMessageRepository) { }

    async execute(userId: string) {
        return this.messageRepository.findByUserId(userId);
    }
}
