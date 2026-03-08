import { Request, Response } from "express";
import { PrismaPetitionRepository } from "../../database/repositories/petition.repository";
import { PrismaUserRepository } from "../../database/repositories/user.repository";
import { CreatePetitionUseCase } from "../../../core/usecases/petition/CreatePetitionUseCase";
import { SignPetitionUseCase } from "../../../core/usecases/petition/SignPetitionUseCase";
import { GetPetitionAnalyticsUseCase } from "../../../core/usecases/petition/GetPetitionAnalyticsUseCase";

const petitionRepo = new PrismaPetitionRepository();
const createUseCase = new CreatePetitionUseCase(petitionRepo);
const signUseCase = new SignPetitionUseCase(petitionRepo);
const getAnalyticsUseCase = new GetPetitionAnalyticsUseCase(petitionRepo);

export class PetitionController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await createUseCase.execute({ ...req.body, createdBy: userId });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async sign(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await signUseCase.execute({ ...req.body, userId, petitionId: req.params.id as string, ipAddress: req.ip, userAgent: req.headers['user-agent'] as string });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const result = await getAnalyticsUseCase.execute(req.params.id as string);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  // Temporary list method to ease routing
  async list(req: Request, res: Response) {
    try {
      const result = await petitionRepo.findAll(req.query);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async listMine(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await petitionRepo.findAll({ ...req.query, createdBy: userId });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const result = await petitionRepo.findById(req.params.id as string);
      if (!result) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

