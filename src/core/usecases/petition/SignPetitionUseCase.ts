import { IPetitionRepository } from "../../repositories/petition-repository.interface";
import { IUserRepository } from "../../repositories/user-repository.interface";

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
  ) { }

  async execute(data: SignRequest) {
    const petition = await this.petitionRepo.findById(data.petitionId);
    if (!petition || petition.status !== "active") throw new Error("Petição inválida ou inativa");

    try {
      await this.petitionRepo.sign(data.petitionId, {
        userId: data.userId,
        voterRegistrationNumber: data.voterRegistrationNumber,
        fullName: data.fullName,
        cpfHash: data.cpfHash,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent
      });
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