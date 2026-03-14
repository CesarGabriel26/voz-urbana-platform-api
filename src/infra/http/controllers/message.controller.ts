import { Request, Response } from "express";
import { MessageRepository } from "../../database/repositories/message.repository";
import { ListMessagesUseCase } from "../../../core/usecases/message/ListMessagesUseCase";
import { UpdateMessageUseCase } from "../../../core/usecases/message/UpdateMessageUseCase";
import { DeleteMessageUseCase } from "../../../core/usecases/message/DeleteMessageUseCase";

const repo = new MessageRepository();
const listUseCase = new ListMessagesUseCase(repo);
const updateUseCase = new UpdateMessageUseCase(repo);
const deleteUseCase = new DeleteMessageUseCase(repo);

export class MessageController {
    async list(req: Request, res: Response) {
        try {
            const userId = (req as any).user.sub;
            const result = await listUseCase.execute(userId);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = (req as any).user.sub;
            const result = await updateUseCase.execute(req.params.id as string, userId, req.body);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(error.message.includes("not found") ? 404 : 400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = (req as any).user.sub;
            await deleteUseCase.execute(req.params.id as string, userId);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(error.message.includes("not found") ? 404 : 400).json({ message: error.message });
        }
    }
}
