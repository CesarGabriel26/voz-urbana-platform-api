"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetitionController = void 0;
const prisma_petition_repository_1 = require("../../database/repositories/prisma-petition.repository");
const prisma_user_repository_1 = require("../../database/repositories/prisma-user.repository");
const CreatePetitionUseCase_1 = require("../../../core/usecases/petition/CreatePetitionUseCase");
const SignPetitionUseCase_1 = require("../../../core/usecases/petition/SignPetitionUseCase");
const GetPetitionAnalyticsUseCase_1 = require("../../../core/usecases/petition/GetPetitionAnalyticsUseCase");
const petitionRepo = new prisma_petition_repository_1.PrismaPetitionRepository();
const userRepo = new prisma_user_repository_1.PrismaUserRepository();
const createUseCase = new CreatePetitionUseCase_1.CreatePetitionUseCase(petitionRepo);
const signUseCase = new SignPetitionUseCase_1.SignPetitionUseCase(petitionRepo, userRepo);
const getAnalyticsUseCase = new GetPetitionAnalyticsUseCase_1.GetPetitionAnalyticsUseCase(petitionRepo);
class PetitionController {
    async create(req, res) {
        try {
            const userId = req.user.sub;
            const result = await createUseCase.execute({ ...req.body, createdBy: userId });
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async sign(req, res) {
        try {
            const userId = req.user.sub;
            const result = await signUseCase.execute({ ...req.body, userId, petitionId: req.params.id });
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getAnalytics(req, res) {
        try {
            const result = await getAnalyticsUseCase.execute(req.params.id);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    // Temporary list method to ease routing
    async list(req, res) {
        try {
            const result = await petitionRepo.findAll(req.query);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getById(req, res) {
        try {
            const result = await petitionRepo.findById(req.params.id);
            if (!result)
                return res.status(404).json({ message: "Not found" });
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.PetitionController = PetitionController;
