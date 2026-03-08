"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteComplaintUseCase = void 0;
class VoteComplaintUseCase {
    complaintRepository;
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    async execute(complaintId, userId) {
        const complaint = await this.complaintRepository.findById(complaintId);
        if (!complaint) {
            throw new Error("Complaint not found");
        }
        await this.complaintRepository.vote(complaintId, userId);
    }
}
exports.VoteComplaintUseCase = VoteComplaintUseCase;
