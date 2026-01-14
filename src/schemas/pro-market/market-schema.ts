import { z } from 'zod'

export const cancelOrderSchema = z.object({
  motif: z.string().min(5, 'Motif must be at least 5 characters'),
  content: z.string().min(5, 'Content must be at least 5 characters'),
  attachements: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
})

export const defaultCancelOrder: z.infer<typeof cancelOrderSchema> = {
  motif: '',
  content: '',
  attachements: null,
}
