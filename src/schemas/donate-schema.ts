import { z } from 'zod'
export const MultiProductSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  productImages: z.union([z.string(), z.instanceof(File)]).optional(),
  type: z.string().optional(),
  quantity: z.number().optional(),
  expirationDate: z.date().optional(),
  unity: z.string().optional(),
})
export type MultiProductType = z.infer<typeof MultiProductSchema>
export const StepOneDonate = z.object({
  productImages: z.union([z.string(), z.instanceof(File)]),
  title: z.string(),
  description: z.string(),
  unity: z.string(),
  quantity: z.number(),
  type: z.string(),
  barCode: z.string().optional(),
  MultiProductSchema: z.array(MultiProductSchema).optional(),
  expirationDate: z.date().optional(),
  id: z.string().optional(),
})

export const StepTwoDonateSchema = z.object({
  consumptionMethods: z.string().min(1, 'Méthode de consommation requise'),
  deliveryCost: z.number().min(1, 'Frais de livraison requis'),
})

export const StepThreeDonateSchema = z.object({
  startDate: z.date({ message: 'Start date is required' }),
  endDate: z.date({ message: 'End date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
})

export const DonateSchema = StepOneDonate.extend(StepTwoDonateSchema.shape)
  .extend(StepThreeDonateSchema.shape)
  .refine(
    (data) => {
      if (data.type === 'MULTIPLE') {
        // Check if MultiProductSchema has length > 0
        return data.MultiProductSchema && data.MultiProductSchema.length > 0
      }
      return true
    },
    {
      message: 'Please provide at least one product',
      path: ['MultiProductSchema'],
    }
  )

export type DonateType = z.infer<typeof DonateSchema> & {
  relaunchModifyResponse: {
    organizationNameRelaunch: string | null
    relaunchDate: string | null
    organizationNameModifiy: string | null
    modifiyDate: string | null
  }
}
