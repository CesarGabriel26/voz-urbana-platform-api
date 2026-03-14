import { IComplaintRepository } from "../../repositories/complaint-repository.interface";
import { Complaint } from "../../models/complaint.model";

export class UpdateComplaintUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

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

    // Se não for admin, não pode mudar o status
    if (!isAdmin && updateData.status !== undefined && updateData.status !== complaint.status) {
        throw new Error("Only admins can update complaint status");
    }

    // Se o status for resolvido, define a data de resolução
    if (updateData.status === 'resolved' && complaint.status !== 'resolved') {
        updateData.resolvedAt = new Date();
    }

    return this.complaintRepository.update(id, updateData);
  }
}
