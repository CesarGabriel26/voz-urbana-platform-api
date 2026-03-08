"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
class UpdateUserUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, data) {
        // Busca usuário
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
        // Não permite atualizar id, email ou cpf diretamente aqui (regras de negócio)
        const { id, email, cpf, createdAt, updatedAt, ...updateData } = data;
        const updatedUser = await this.userRepository.update(userId, updateData);
        return updatedUser;
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
