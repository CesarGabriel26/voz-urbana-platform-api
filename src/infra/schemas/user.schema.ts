import { z } from "zod";

export const loginRequestSchema = z.object({
    cpf: z.string().min(11, "CPF inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

export type LoginRequestDTO = z.infer<typeof loginRequestSchema>;

export const signupRequestSchema = z.object({
    name: z.string().min(2),
    cpf: z.string().min(11),
    birthDate: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6)
});

export type SignupRequestDTO = z.infer<typeof signupRequestSchema>;