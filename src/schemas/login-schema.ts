import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  remember: z.boolean().optional(),
})
