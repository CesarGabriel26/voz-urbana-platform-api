"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetComplaintByIdUseCase = void 0;
class GetComplaintByIdUseCase {
    complaintRepository;
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    async execute(id) {
        const complaint = await this.complaintRepository.findById(id);
        if (!complaint) {
            throw new Error("Complaint not found");
        }
        return complaint;
    }
}
exports.GetComplaintByIdUseCase = GetComplaintByIdUseCase;
