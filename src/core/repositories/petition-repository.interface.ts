import { Petition } from "../models/petition.model";

export interface IPetitionRepository {
  create(data: Omit<Petition, "id" | "createdAt" | "updatedAt">): Promise<Petition>;
  findById(id: string): Promise<Petition | null>;
  findAll(filters?: any): Promise<Petition[]>;
  update(id: string, data: Partial<Petition>): Promise<Petition>;
  sign(petitionId: string, signatureData: any): Promise<void>;
  findSignersByPetitionId(petitionId: string): Promise<string[]>;
}
