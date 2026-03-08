import { ICategoryRepository } from "../../repositories/category-repository.interface";
import { Category } from "../../models/category.model";

export class UpdateCategoryUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(id: string, data: Partial<Category>) {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new Error("Category not found");
        }

        const { id: _, createdBy, createdAt, updatedAt, ...updateData } = data as any;

        return this.categoryRepository.update(id, updateData);
    }
}
