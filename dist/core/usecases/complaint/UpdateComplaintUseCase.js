"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComplaintUseCase = void 0;
class UpdateComplaintUseCase {
    complaintRepository;
    constructor(complaintRepository) {
        this.complaintRepository = complaintRepository;
    }
    async execute(id, userId, data) {
        const complaint = await this.complaintRepository.findById(id);
        if (!complaint) {
            throw new Error("Complaint not found");
        }
        if (complaint.createdBy !== userId) {
            throw new Error("Unauthorized to update this complaint");
        }
        const { id: _, createdBy, createdAt, updatedAt, ...updateData } = data;
        return this.complaintRepository.update(id, updateData);
    }
}
exports.UpdateComplaintUseCase = UpdateComplaintUseCase;
