import { ContactType, PartnerInfoDto } from '@/types/GlobalType'
import { z } from 'zod'

export type ProfileType = {
  id: string
  name: {
    firstName: string
    lastName: string
  }
  avatar: string
  role: string
  phone: string
  email: string
  organization: PartnerInfoDto
  responsible: {
    email: string
    phone: string
    avatarPath: string
    name: string
  }
}
export const profileSchema = z.object({
  id: z.string().nullable().optional(),
  name: z
    .object({
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
    })
    .optional(),
  avatar: z.union([z.string(), z.instanceof(File)]),
  role: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  organization: z.object({
    avatarPath: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
  }),
  responsible: z.object({
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().email().nullable().optional(),
    avatarPath: z.string().nullable().optional(),
  }),
})

export const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, 'Old password must be at least 6 characters long'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters long'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation must match',
    path: ['confirmPassword'], // This will highlight the confirmPassword field
  })

export type ProfileSchemaType = z.infer<typeof profileSchema>
