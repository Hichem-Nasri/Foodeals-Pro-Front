import { z } from 'zod'

export const Price = z.object({
  amount: z.number(),
  currency: z.string().optional().default('MAD'),
})

export const CoditonPickUp = z.object({
  id: z.string().optional(),
  conditionName: z.string().optional(),
  daysBeforePickup: z
    .number()
    .optional()
    .transform((val) => 'J-' + val),
  discountPercentage: z
    .number()
    .optional()
    .transform((val) => val + '%'),
})

export const ProductSchema = z.object({
  name: z.string().optional(),
  title: z.string(),
  description: z.string(),
  barcode: z.string(),
  type: z.string(),
  imageUrl: z.union([z.string(), z.instanceof(File)]),
  category: z.object({
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
  }),
  subCategory: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
  }),
  brand: z.string(),
  rayon: z.string(),
  pickupConditions: z.array(CoditonPickUp).optional(),
  paymentMethodResponse: z
    .object({
      id: z.string().optional().nullable(),
      methodName: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  deliveryMethodResponse: z
    .object({
      id: z.string().optional().nullable(),
      deliveryName: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
})
// /products/search?name=ProductName&brand=BrandName&categoryId=123e4567-e89b-12d3-a456-426614174000&subCategoryId=123e4567-e89b-12d3-a456-426614174001&barcode=123456789&page=0&size=10&sort=name,asc
export const FilterSchemaProduct = z.object({
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
  name: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  barcode: z.string().optional(),
})

export const defaultProductSchema = {
  startDate: '',
  endDate: '',
  organizationId: '',
  importerId: '',
  productId: '',
  brand: '',
  category: '',
  subCategory: '',
  codeBar: '',
}

export const ProductStatusSchema = z.object({
  urgent: z.object({
    reduction: z.number().min(0).max(100),
    days: z.number().min(1),
  }),
  required: z.object({
    reduction: z.number().min(0).max(100),
    days: z.number().min(1),
  }),
  desirable: z.object({
    reduction: z.number().min(0).max(100),
    days: z.number().min(1),
  }),
})
