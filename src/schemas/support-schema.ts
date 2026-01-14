import { z } from 'zod'

export const SupportSchema = z.object({
  typeRequest: z.string().min(1, 'Ce champ est requis'),
  subEntityId: z.string().min(1, 'Selectionnez une entité'),
  attachment: z.union([z.string(), z.instanceof(File)]),
  title: z.string().min(1, 'titre est requis'),
  content: z.string().min(1, 'Contenu est requis'),
})
