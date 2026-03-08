import { Request, Response } from "express";
import { PrismaComplaintRepository } from "../../database/repositories/complaint.repository";
import { CreateComplaintUseCase } from "../../../core/usecases/complaint/CreateComplaintUseCase";
import { ListComplaintsUseCase } from "../../../core/usecases/complaint/ListComplaintsUseCase";
import { GetComplaintByIdUseCase } from "../../../core/usecases/complaint/GetComplaintByIdUseCase";
import { UpdateComplaintUseCase } from "../../../core/usecases/complaint/UpdateComplaintUseCase";
import { DeleteComplaintUseCase } from "../../../core/usecases/complaint/DeleteComplaintUseCase";
import { VoteComplaintUseCase } from "../../../core/usecases/complaint/VoteComplaintUseCase";

const repo = new PrismaComplaintRepository();
const createUseCase = new CreateComplaintUseCase(repo);
const listUseCase = new ListComplaintsUseCase(repo);
const getByIdUseCase = new GetComplaintByIdUseCase(repo);
const updateUseCase = new UpdateComplaintUseCase(repo);
const deleteUseCase = new DeleteComplaintUseCase(repo);
const voteUseCase = new VoteComplaintUseCase(repo);

export class ComplaintController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await createUseCase.execute({ ...req.body, createdBy: userId });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const result = await listUseCase.execute(req.query);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async listMine(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await listUseCase.execute({...req.query, createdBy: userId});
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }


  async getById(req: Request, res: Response) {
    try {
      const result = await getByIdUseCase.execute(req.params.id as string);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      const result = await updateUseCase.execute(req.params.id as string, userId, req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      await deleteUseCase.execute(req.params.id as string, userId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async vote(req: Request, res: Response) {
    try {
      const userId = (req as any).user.sub;
      await voteUseCase.execute(req.params.id as string, userId);
      return res.status(201).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
