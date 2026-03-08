import { Complaint } from "../models/complaint.model";

export interface IComplaintRepository {
  create(data: Omit<Complaint, "id" | "createdAt" | "updatedAt">): Promise<Complaint>;
  findById(id: string): Promise<Complaint | null>;
  findAll(filters?: any): Promise<Complaint[]>;
  update(id: string, data: Partial<Complaint>): Promise<Complaint>;
  delete(id: string): Promise<void>;
  vote(complaintId: string, userId: string): Promise<void>;
}
