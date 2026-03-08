import { IUserRepository } from "../../repositories/user-repository.interface";
import { User } from "../../models/user.model";

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, data: Partial<User>) {
    // Busca usuário
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // Não permite atualizar id, email ou cpf diretamente aqui (regras de negócio)
    const { id, email, cpf, createdAt, updatedAt, ...updateData } = data as any;

    const updatedUser = await this.userRepository.update(userId, updateData);
    
    return updatedUser;
  }
}
