import { IPetitionRepository } from "../../repositories/petition-repository.interface";
import { Petition } from "../../models/petition.model";
import { IUserRepository } from "../../repositories/user-repository.interface";
import { PushNotificationService } from "../../../infra/services/push-notification.service";
import { PETITION_STATUS, PETITION_STATUS_LABELS } from "../../constants/status.constants";

export class UpdatePetitionUseCase {
  constructor(
    private petitionRepository: IPetitionRepository,
    private userRepository: IUserRepository,
    private pushService: PushNotificationService
  ) {}

  async execute(id: string, userId: string, userRole: string, data: Partial<Petition>) {
    const petition = await this.petitionRepository.findById(id);
    if (!petition) {
      throw new Error("Petition not found");
    }

    const isAdmin = userRole === "ADMIN";

    if (petition.createdBy !== userId && !isAdmin) {
      throw new Error("Unauthorized to update this petition");
    }

    const { id: _, createdBy, createdAt, updatedAt, ...updateData } = data as any;
    if (updateData.status !== undefined) updateData.status = Number(updateData.status);

    const oldStatus = petition.status;

    // Se não for admin, só pode mudar status se for para completar/arquivar dependendo da lógica (mas aqui vamos seguir o padrão do admin)
    if (!isAdmin && updateData.status !== undefined && updateData.status !== petition.status) {
        throw new Error("Only admins can update petition status");
    }

    const updatedPetition = await this.petitionRepository.update(id, updateData);

    // Notificar se o status mudou
    if (updateData.status && updateData.status !== oldStatus) {
      const statusLabel = PETITION_STATUS_LABELS[updateData.status] || `Status ${updateData.status}`;

      const creator = await this.userRepository.findById(petition.createdBy);
      if (creator) {
        await this.pushService.notifyUser(
          creator,
          'Sua petição foi atualizada!',
          `O status da petição "${petition.title}" mudou para ${statusLabel}.`,
          'petitionStatusChanged'
        );
      }

      // Notificar assinantes
      const signersIds = await this.petitionRepository.findSignersByPetitionId(id);
      for (const signerId of signersIds) {
        const signer = await this.userRepository.findById(signerId);
        if (signer) {
          await this.pushService.notifyUser(
            signer,
            'Uma petição que você assinou foi atualizada!',
            `O status da petição "${petition.title}" mudou para ${statusLabel}.`,
            'petitionStatusChanged'
          );
        }
      }
    }

    return updatedPetition;
  }
}
