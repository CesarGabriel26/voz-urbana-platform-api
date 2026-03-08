import { Request, Response } from "express";
import { PrismaCategoryRepository } from "../../database/repositories/category.repository";
import { CreateCategoryUseCase } from "../../../core/usecases/category/CreateCategoryUseCase";
import { ListCategoriesUseCase } from "../../../core/usecases/category/ListCategoriesUseCase";
import { GetCategoryByIdUseCase } from "../../../core/usecases/category/GetCategoryByIdUseCase";
import { UpdateCategoryUseCase } from "../../../core/usecases/category/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../../../core/usecases/category/DeleteCategoryUseCase";

const repo = new PrismaCategoryRepository();
const createUseCase = new CreateCategoryUseCase(repo);
const listUseCase = new ListCategoriesUseCase(repo);
const getByIdUseCase = new GetCategoryByIdUseCase(repo);
const updateUseCase = new UpdateCategoryUseCase(repo);
const deleteUseCase = new DeleteCategoryUseCase(repo);

export class CategoryController {
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
            const result = await listUseCase.execute();
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
            const result = await updateUseCase.execute(req.params.id as string, req.body);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await deleteUseCase.execute(req.params.id as string);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
