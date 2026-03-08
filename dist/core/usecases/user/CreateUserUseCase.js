"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
class CreateUserUseCase {
    userRepository;
    hashProvider;
    constructor(userRepository, hashProvider) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
    }
    async execute(data) {
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
exports.CreateUserUseCase = CreateUserUseCase;
