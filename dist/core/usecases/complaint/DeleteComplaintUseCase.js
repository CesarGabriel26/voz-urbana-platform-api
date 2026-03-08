"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteComplaintUseCase = void 0;
class DeleteComplaintUseCase {
    complaintRepository;
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    async execute(id, userId) {
        const complaint = await this.complaintRepository.findById(id);
        if (!complaint) {
            throw new Error("Complaint not found");
        }
        if (complaint.createdBy !== userId) {
            throw new Error("Unauthorized to delete this complaint");
        }
        await this.complaintRepository.delete(id);
    }
}
exports.DeleteComplaintUseCase = DeleteComplaintUseCase;
