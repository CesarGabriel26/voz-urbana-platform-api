import { IUserRepository } from "../../repositories/user-repository.interface";
import { IHashProvider } from "../../../infra/providers/hash-provider.interface";
import { SignupRequest } from "../../models/user.model";

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashProvider: IHashProvider
  ) {}

  async execute(data: SignupRequest) {
    // Verificações
    const userWithEmail = await this.userRepository.findByEmail(data.email);
    if (userWithEmail) {
      throw new Error("E-mail já está em uso.");
    }

    const userWithCpf = await this.userRepository.findByCpf(data.cpf);
    if (userWithCpf) {
      throw new Error("CPF já está em uso.");
    }

    // Hash da senha
    const hashedPassword = await this.hashProvider.hash(data.password || "");

    // Criação
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      birthDate: new Date(data.birthDate), // parsing
      phoneNumber: data.phone || undefined,
      password: hashedPassword,
      avatarUrl: undefined,
      role: "user"
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}
