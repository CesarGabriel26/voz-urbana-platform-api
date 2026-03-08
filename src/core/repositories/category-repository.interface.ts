import { Category } from "../models/category.model";

export interface ICategoryRepository {
    findById(id: string): Promise<Category | null>;
    findAll(filters?: any): Promise<Category[]>;
    create(data: Omit<Category, "id" | "createdAt">): Promise<Category>;
    update(id: string, data: Omit<Category, "id" | "createdAt">): Promise<Category>;
    delete(id: string): Promise<void>;
}