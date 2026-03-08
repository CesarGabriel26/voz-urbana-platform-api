import { IComplaintRepository } from "../../repositories/complaint-repository.interface";

export class DeleteComplaintUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async execute(id: string, userId: string) {
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
