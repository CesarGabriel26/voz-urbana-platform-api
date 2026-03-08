import { IComplaintRepository } from "../../repositories/complaint-repository.interface";

export class VoteComplaintUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async execute(complaintId: string, userId: string) {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    await this.complaintRepository.vote(complaintId, userId);
  }
}
