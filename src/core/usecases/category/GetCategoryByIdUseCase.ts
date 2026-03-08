import { ICategoryRepository } from "../../repositories/category-repository.interface";

export class GetCategoryByIdUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  }
}
