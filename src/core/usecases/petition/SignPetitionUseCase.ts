import { IPetitionRepository } from "../../repositories/petition-repository.interface";
import { IUserRepository } from "../../repositories/user-repository.interface";
import { PushNotificationService } from "../../../infra/services/push-notification.service";

import { PETITION_STATUS } from "../../constants/status.constants";

type SignRequest = {
  petitionId: string;
  userId: string;
  voterRegistrationNumber?: string;
  fullName: string;
  cpfHash: string;
  ipAddress: string;
  userAgent: string;
};

export class SignPetitionUseCase {
  constructor(
    private petitionRepo: IPetitionRepository,
    private userRepository: IUserRepository,
    private pushService: PushNotificationService
  ) { }

  async execute(data: SignRequest) {
    const petition = await this.petitionRepo.findById(data.petitionId);
    
    // Status -1 significa cancelada/arquivada/rejeitada
    if (!petition || petition.status === PETITION_STATUS.CANCELLED) throw new Error("Petição inválida ou inativa");

    try {
      await this.petitionRepo.sign(data.petitionId, {
        userId: data.userId,
        voterRegistrationNumber: data.voterRegistrationNumber,
        fullName: data.fullName,
        cpfHash: data.cpfHash,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      });

      // Notificar o criador
      const creator = await this.userRepository.findById(petition.createdBy);
      if (creator && creator.id !== data.userId) {
        await this.pushService.notifyUser(
          creator,
          'Nova assinatura!',
          `Alguém assinou sua petição: "${petition.title}".`,
          'petitionVoted'
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
      data: petition,
      message: "Documento assinado com sucesso"
    };
  }
}