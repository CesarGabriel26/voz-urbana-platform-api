import { IComplaintRepository } from "../../repositories/complaint-repository.interface";
import { IUserRepository } from "../../repositories/user-repository.interface";
import { PushNotificationService } from "../../../infra/services/push-notification.service";

export class VoteComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private userRepository: IUserRepository,
    private pushService: PushNotificationService
  ) { }

  async execute(complaintId: string, userId: string) {
    const complaint = await this.complaintRepository.findById(complaintId);
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    try {
      await this.complaintRepository.vote(complaintId, userId);

      // Notificar o criador
      const creator = await this.userRepository.findById(complaint.createdBy);
      if (creator && creator.id !== userId) {
        await this.pushService.notifyUser(
          creator,
          'Nova interação!',
          `Alguém apoiou sua reclamação: "${complaint.title}".`,
          'complaintVoted'
        );
      }
    } catch (err: any) {
      if (err.code == "23505") {
        throw new Error("Você já assinou este documento.");
      }
      throw err;
    }
    return {
      success: true,
      data: complaint,
      message: "Documento apoiado com sucesso"
    };
  }
}
