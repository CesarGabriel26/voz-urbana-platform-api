import { IComplaintRepository } from "../../repositories/complaint-repository.interface";

export class VoteComplaintUseCase {
  constructor(private complaintRepository: IComplaintRepository) { }

  async execute(complaintId: string, userId: string) {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    try {
      await this.complaintRepository.vote(complaintId, userId);
    } catch (err: any) {
      if (err.code == "23505") {
        throw new Error("Você já assinou este documento.");
      }
      throw err;
    }
    return {
      success: true,
      data: complaint,
      message: "Documento assinado com sucesso"
    };
  }
}
