"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePetitionUseCase = void 0;
class CreatePetitionUseCase {
    petitionRepository;
    constructor(petitionRepository) {
        this.petitionRepository = petitionRepository;
    }
    async execute(data) {
        if (!data.title || !data.description || !data.category || !data.createdBy) {
            throw new Error("Missing required fields for Petition");
        }
        const petitionData = { ...data, signaturesCount: 0 };
        const petition = await this.petitionRepository.create(petitionData);
        return petition;
    }
}
exports.CreatePetitionUseCase = CreatePetitionUseCase;
