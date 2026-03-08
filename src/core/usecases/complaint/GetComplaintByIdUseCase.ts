import { IComplaintRepository } from "../../repositories/complaint-repository.interface";

export class GetComplaintByIdUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async execute(id: string) {
    const complaint = await this.complaintRepository.findById(id);
    if (!complaint) {
      throw new Error("Complaint not found");
    }
    return complaint;
  }
}
