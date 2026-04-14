import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido").trim().toLowerCase(),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo"),
    email: z.email("Informe um e-mail válido").trim().toLowerCase(),
    phone: z.string().min(10, "Informe um telefone válido"),
    password: z.string().min(8, "A senha precisa ter ao menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirme a senha"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
