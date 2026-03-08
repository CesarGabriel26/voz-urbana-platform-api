import { IPetitionRepository } from "../../repositories/petition-repository.interface";
import { Petition } from "../../models/petition.model";

export class CreatePetitionUseCase {
  constructor(private petitionRepository: IPetitionRepository) {}

  async execute(data: Omit<Petition, "id" | "createdAt" | "updatedAt" | "signaturesCount">) {
    if (!data.title || !data.description || !data.category || !data.createdBy) {
      throw new Error("Missing required fields for Petition");
    }

    const petitionData = { ...data, signaturesCount: 0 };
    const petition = await this.petitionRepository.create(petitionData);
    return petition;
  }
}
