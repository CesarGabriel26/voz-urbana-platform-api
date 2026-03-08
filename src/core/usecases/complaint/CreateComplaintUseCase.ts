import { IComplaintRepository } from "../../repositories/complaint-repository.interface";
import { Complaint } from "../../models/complaint.model";

export class CreateComplaintUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async execute(data: Omit<Complaint, "id" | "createdAt" | "updatedAt">) {
    if (!data.title || !data.description || !data.category || !data.lat || !data.lng || !data.createdBy) {
      throw new Error("Missing required fields");
    }

    const complaint = await this.complaintRepository.create(data);
    return complaint;
  }
}
