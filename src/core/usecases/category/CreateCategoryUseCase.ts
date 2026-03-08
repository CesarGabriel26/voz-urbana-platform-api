import { ICategoryRepository } from "../../repositories/category-repository.interface";
import { Category } from "../../models/category.model";

export class CreateCategoryUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(data: Omit<Category, "id" | "createdAt">) {
    if (!data.name || !data.type || !data.weight || !data.description || !data.active) {
      throw new Error("Missing required fields");
    }

    const category = await this.categoryRepository.create(data);
    return category;
  }
}
