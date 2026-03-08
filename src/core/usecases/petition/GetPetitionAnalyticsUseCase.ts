import { IPetitionRepository } from "../../repositories/petition-repository.interface";

export class GetPetitionAnalyticsUseCase {
  constructor(private petitionRepository: IPetitionRepository) {}

  async execute(petitionId: string) {
    const petition = await this.petitionRepository.findById(petitionId);
    if (!petition) throw new Error("Petition not found");

    // Stub for actual analytics calculation
    const progressPercentage = (petition.signaturesCount / petition.goal) * 100;
    
    return {
      petitionId: petition.id,
      goal: petition.goal,
      signaturesCount: petition.signaturesCount,
      progressPercentage: Math.min(progressPercentage, 100).toFixed(2)
    };
  }
}
