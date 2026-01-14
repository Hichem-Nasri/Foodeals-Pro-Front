import { z } from 'zod'

export const BoxSurpriseFormStepOneSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  publishAs: z.string().trim().min(1, 'Publish as is required'),
  description: z
    .string()
    .min(1, 'description is required')
    .max(300, 'description is too long'),

  unitType: z.string().trim().min(1, 'Unit type is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

export type BoxSurpriseFormStepOneType = z.infer<
  typeof BoxSurpriseFormStepOneSchema
>

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const IMAGE_SCHEMA = z
  .array(z.instanceof(File))
  .refine((files) => files.length > 0, 'Image is required.')
  .refine((files) => files[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
    'Only .jpg, .png, and .webp formats are supported.'
  )
  .nullable()

export const BoxNormalFormStepOneSchema = z
  .object({
    image: IMAGE_SCHEMA,

    categorie: z.string().min(1, 'categorie is required'),
  })
  .extend(BoxSurpriseFormStepOneSchema.shape)

export type BoxNormalFormStepOneType = z.infer<
  typeof BoxNormalFormStepOneSchema
>

export const StepTwoSchema = z.object({
  consumptionMethods: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
  deliveryCost: z.number(),
  initialPrice: z.number().int().min(1, 'Initial price is required'),
  reductionPercentage: z
    .number()
    .int()
    .min(1, 'Reduction percentage is required'),
})

export type StepTwoType = z.infer<typeof StepTwoSchema>

export const StepThreeSchema = z.object({
  startDate: z.date({ message: 'Start date is required' }),
  endDate: z.date({ message: 'End date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  expirationDate: z.date({ message: 'Expiration date is required' }),
  paymentMethod: z.enum(['CARD', 'CASH'], {
    required_error: 'You need to select a notification type.',
  }),
})

export type StepThreeType = z.infer<typeof StepThreeSchema>

export const BoxSurpriseFormSchema = BoxSurpriseFormStepOneSchema.extend(
  StepTwoSchema.shape
).extend(StepThreeSchema.shape)

export type BoxSurpriseFormType = z.infer<typeof BoxSurpriseFormSchema>

export const BoxNormalFormSchema = BoxNormalFormStepOneSchema.extend(
  BoxSurpriseFormStepOneSchema.shape
)
  .extend(StepTwoSchema.shape)
  .extend(StepThreeSchema.shape)

export type BoxNormalFormType = z.infer<typeof BoxNormalFormSchema>

export const BoxSurpriseFormDefaultValues: BoxSurpriseFormType = {
  title: '',
  publishAs: '',
  description: '',
  unitType: '',
  quantity: 1,
  consumptionMethods: [],
  deliveryCost: 0,
  initialPrice: 0,
  reductionPercentage: 0,
  startDate: new Date(),
  endDate: new Date(),
  startTime: '',
  endTime: '',
  expirationDate: new Date(),
  paymentMethod: 'CARD',
}

export const BoxNormalFormDefaultValues: BoxNormalFormType = {
  image: null,
  title: '',
  publishAs: '',
  categorie: '',
  description: '',
  unitType: '',
  quantity: 1,
  consumptionMethods: [],
  deliveryCost: 0,
  initialPrice: 0,
  reductionPercentage: 0,
  startDate: new Date(),
  endDate: new Date(),
  startTime: '',
  endTime: '',
  expirationDate: new Date(),
  paymentMethod: 'CARD',
}

export const boxBaseDefaultValues = {
  ...BoxNormalFormDefaultValues,
  categorie: 'placeholder',
}
