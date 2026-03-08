import { IComplaintRepository } from "../../repositories/complaint-repository.interface";

export class ListComplaintsUseCase {
  constructor(private complaintRepository: IComplaintRepository) {}

  async execute(filters?: any) {
    return this.complaintRepository.findAll(filters);
  }
}
