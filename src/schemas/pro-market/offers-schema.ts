import {
  StepThreeSchema,
  StepTwoSchema,
} from '@/app/[locale]/pro-market/components/common-form-steps/CommonFormSchema'
import { z } from 'zod'

export const SupplementSchema =
  z.object({
    id: z.string().optional(),
    name: z.string(),
    price: z.number(),
    image: z.union([
      z.string(),
      z.instanceof(File),
    ]),
  })

export const StepOneDealSchema =
  z.object({
    productImages: z
      .array(
        z.union([
          z.string(),
          z.instanceof(File),
        ])
      )
      .nonempty(
        'Vous devez ajouter au moins une image'
      )
      .refine((images) => {
        return (
          images.filter(
            (image) =>
              (typeof image ===
                'string' &&
                image.length > 0) ||
              image instanceof File
          ).length > 0
        )
      }),
    title: z
      .string()
      .min(
        3,
        'Le titre doit contenir au moins 3 caractères'
      ),
    category: z
      .string()
      .min(
        3,
        'La catégorie doit contenir au moins 3 caractères'
      ),
    description: z
      .string()
      .min(
        3,
        'La description doit contenir au moins 3 caractères'
      ),
    type: z
      .string()
      .min(
        3,
        'Le type doit contenir au moins 3 caractères'
      ),
    supplements: z
      .array(SupplementSchema)
      .optional(),
    unity: z
      .string()
      .min(1, "Selectionnez l'unité"),
    quantity: z
      .number()
      .min(
        1,
        'La quantité doit être supérieure à 0'
      ),
    sauces: z
      .array(SupplementSchema)
      .optional(),
    sodas: z
      .array(SupplementSchema)
      .optional(),
    barCode: z.string().optional(),
    id: z.string().optional(),
  })

export const StepOneDealProSchema =
  z.object({
    id: z.string().optional(),
    productImages: z
      .array(
        z.union([
          z.string(),
          z.instanceof(File),
        ])
      )
      .nonempty(
        'Vous devez ajouter au moins une image'
      )
      .refine((images) => {
        return (
          images.filter(
            (image) =>
              (typeof image ===
                'string' &&
                image.length > 0) ||
              image instanceof File
          ).length > 0
        )
      }),
    typeProduct: z
      .string()
      .min(
        3,
        'Le type doit contenir au moins 3 caractères'
      ),
    title: z
      .string()
      .min(
        3,
        'Le titre doit contenir au moins 3 caractères'
      ),
    category: z
      .string()
      .min(
        3,
        'La catégorie doit contenir au moins 3 caractères'
      ),
    description: z
      .string()
      .min(
        3,
        'La description doit contenir au moins 3 caractères'
      ),
    type: z
      .string()
      .min(
        3,
        'Le type doit contenir au moins 3 caractères'
      ),
    defaultUnity: z
      .object({
        unity: z.string().optional(),
        x30: z.number().optional(),
        x60: z.number().optional(),
        x120: z.number().optional(),
      })
      .optional(),
    customUnity: z
      .object({
        unity: z.string().optional(),
        global: z.object({
          quantity: z
            .union([
              z.number(),
              z.string(),
            ])
            .optional(),
          price: z.number().optional(),
        }),
        min: z.object({
          quantity: z
            .union([
              z.number(),
              z.string(),
            ])
            .optional(),
          price: z.number().optional(),
        }),
      })
      .optional(),
    prixLot: z.number().optional(),
  })

export const StepTwoDealProSchema =
  z.object({
    consumptionMethods: z
      .array(z.string())
      .optional(),
    deliveryCost: z.number(),
    paymentMethod: z.string(),
  })

export const DealSchema =
  StepOneDealSchema.extend(
    StepTwoSchema.shape
  ).extend(StepThreeSchema.shape)

export const DealProSchema =
  StepOneDealProSchema.extend(
    StepTwoDealProSchema.shape
  )
