"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPetitionAnalyticsUseCase = void 0;
class GetPetitionAnalyticsUseCase {
    petitionRepository;
    constructor(petitionRepository) {
        this.petitionRepository = petitionRepository;
    }
    async execute(petitionId) {
        const petition = await this.petitionRepository.findById(petitionId);
        if (!petition)
            throw new Error("Petition not found");
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
exports.GetPetitionAnalyticsUseCase = GetPetitionAnalyticsUseCase;
