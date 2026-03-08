import { IComplaintRepository } from "../../repositories/complaint-repository.interface";
import { Complaint } from "../../models/complaint.model";

export class UpdateComplaintUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async execute(id: string, userId: string, data: Partial<Complaint>) {
    const complaint = await this.complaintRepository.findById(id);
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    if (complaint.createdBy !== userId) {
      throw new Error("Unauthorized to update this complaint");
    }

    const { id: _, createdBy, createdAt, updatedAt, ...updateData } = data as any;

    return this.complaintRepository.update(id, updateData);
  }
}
