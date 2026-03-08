"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComplaintUseCase = void 0;
class CreateComplaintUseCase {
    complaintRepository;
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    async execute(data) {
        if (!data.title || !data.description || !data.category || !data.lat || !data.lng || !data.createdBy) {
            throw new Error("Missing required fields");
        }
        const complaint = await this.complaintRepository.create(data);
        return complaint;
    }
}
exports.CreateComplaintUseCase = CreateComplaintUseCase;
