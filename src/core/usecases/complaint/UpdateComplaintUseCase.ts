import { IComplaintRepository } from "../../repositories/complaint-repository.interface";
import { Complaint } from "../../models/complaint.model";
import { IUserRepository } from "../../repositories/user-repository.interface";
import { PushNotificationService } from "../../../infra/services/push-notification.service";
import { COMPLAINT_STATUS, COMPLAINT_STATUS_LABELS } from "../../constants/status.constants";

export class UpdateComplaintUseCase {
  constructor(
    private complaintRepository: IComplaintRepository,
    private userRepository: IUserRepository,
    private pushService: PushNotificationService
  ) {}

  async execute(id: string, userId: string, userRole: string, data: Partial<Complaint>) {
    const complaint = await this.complaintRepository.findById(id);
    if (!complaint) {
      throw new Error("Complaint not found");
    }

    const isAdmin = userRole === "ADMIN";

    if (complaint.createdBy !== userId && !isAdmin) {
      throw new Error("Unauthorized to update this complaint");
    }

    const { id: _, createdBy, createdAt, updatedAt, ...updateData } = data as any;
    if (updateData.status !== undefined) updateData.status = Number(updateData.status);

    const oldStatus = complaint.status;

    // Se não for admin, não pode mudar o status
    if (!isAdmin && updateData.status !== undefined && updateData.status !== complaint.status) {
        throw new Error("Only admins can update complaint status");
    }

    // Se o status for resolvido, define a data de resolução
    if (updateData.status === COMPLAINT_STATUS.RESOLVED && complaint.status !== COMPLAINT_STATUS.RESOLVED) {
        updateData.resolvedAt = new Date();
    }

    const updatedComplaint = await this.complaintRepository.update(id, updateData);

    // Notificar se o status mudou
    if (updateData.status && updateData.status !== oldStatus) {
      const statusLabel = COMPLAINT_STATUS_LABELS[updateData.status] || `Status ${updateData.status}`;
      
      const creator = await this.userRepository.findById(complaint.createdBy);
      if (creator) {
        await this.pushService.notifyUser(
          creator,
          'Sua reclamação foi atualizada!',
          `O status da reclamação "${complaint.title}" mudou para ${statusLabel}.`,
          'complaintStatusChanged'
        );
      }

      // Notificar votantes
      const votersIds = await this.complaintRepository.findVotersByComplaintId(id);
      for (const voterId of votersIds) {
        const voter = await this.userRepository.findById(voterId);
        if (voter) {
          await this.pushService.notifyUser(
            voter,
            'Uma reclamação que você apoiou foi atualizada!',
            `O status da reclamação "${complaint.title}" mudou para ${statusLabel}.`,
            'complaintStatusChanged'
          );
        }
      }
    }

    return updatedComplaint;
  }
}
