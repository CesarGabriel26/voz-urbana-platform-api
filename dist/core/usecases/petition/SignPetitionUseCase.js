"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignPetitionUseCase = void 0;
class SignPetitionUseCase {
    petitionRepo;
    userRepo;
    constructor(petitionRepo, userRepo) {
        this.petitionRepo = petitionRepo;
        this.userRepo = userRepo;
    }
    async execute(data) {
        const petition = await this.petitionRepo.findById(data.petitionId);
        if (!petition || petition.status !== "active")
            throw new Error("Petição inválida ou inativa");
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
        }
        catch (err) {
            if (err.code === 'P2002') { // Prisma unique constraint violation code
                throw new Error("Você já assinou este documento.");
            }
            throw err;
        }
        return { message: "Documento assinado com sucesso" };
    }
}
exports.SignPetitionUseCase = SignPetitionUseCase;
