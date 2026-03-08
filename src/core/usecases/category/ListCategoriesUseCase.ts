import { ICategoryRepository } from "../../repositories/category-repository.interface";

export class ListCategoriesUseCase {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute() {
        return this.categoryRepository.findAll();
    }
}
