"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const CreateUserUseCase_1 = require("../../../core/usecases/user/CreateUserUseCase");
const UpdateUserUseCase_1 = require("../../../core/usecases/user/UpdateUserUseCase");
const prisma_user_repository_1 = require("../../database/repositories/prisma-user.repository");
const bcrypt_hash_provider_1 = require("../../providers/implementations/bcrypt-hash.provider");
const userRepository = new prisma_user_repository_1.PrismaUserRepository();
const hashProvider = new bcrypt_hash_provider_1.BcryptHashProvider();
const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(userRepository, hashProvider);
const updateUserUseCase = new UpdateUserUseCase_1.UpdateUserUseCase(userRepository);
class UserController {
    async create(req, res) {
        try {
            const result = await createUserUseCase.execute(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async update(req, res) {
        try {
            const userId = req.user.sub;
            const result = await updateUserUseCase.execute(userId, req.body);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
