import { Request, Response } from "express";
import { CreateUserUseCase } from "../../../core/usecases/user/CreateUserUseCase";
import { UpdateUserUseCase } from "../../../core/usecases/user/UpdateUserUseCase";
import { PrismaUserRepository } from "../../database/repositories/user.repository";
import { BcryptHashProvider } from "../../providers/implementations/bcrypt-hash.provider";

const userRepository = new PrismaUserRepository();
const hashProvider = new BcryptHashProvider();
const createUserUseCase = new CreateUserUseCase(userRepository, hashProvider);
const updateUserUseCase = new UpdateUserUseCase(userRepository);

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const result = await createUserUseCase.execute(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await updateUserUseCase.execute(userId, req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async savePushSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const subscription = req.body;
      await userRepository.savePushSubscription(userId, subscription);
      return res.status(200).json({ message: "Subscription saved successfully" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async removePushSubscription(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const { endpoint } = req.body;
      await userRepository.removePushSubscription(userId, endpoint);
      return res.status(200).json({ message: "Subscription removed successfully" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateNotificationSettings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const settings = req.body;
      await userRepository.updateNotificationSettings(userId, settings);
      return res.status(200).json({ message: "Settings updated successfully" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
