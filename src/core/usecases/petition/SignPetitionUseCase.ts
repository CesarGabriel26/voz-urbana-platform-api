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
      private userRepo: IUserRepository
  ) { }

  async execute(data: SignRequest) {
      const petition = await this.petitionRepo.findById(data.petitionId);
      if (!petition || petition.status !== "active") throw new Error("Petição inválida ou inativa");

      // In Prisma, we mapped it as a unique compound index (petitionId, userId).
      // We rely on Prisma to throw a unique constraint error or we can check manually.
      // To keep it simple, we just call sign which will fail if already signed.

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
        if (err.code === 'P2002') { // Prisma unique constraint violation code
          throw new Error("Você já assinou este documento.");
        }
        throw err;
      }
      return { message: "Documento assinado com sucesso" };
  }
}