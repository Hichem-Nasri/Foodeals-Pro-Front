import { z } from 'zod'

export const Price = z.object({
    amount: z.number(),
    currency: z.string().optional().default('MAD'),
})

export const ProductSchemaDlc = z.object({
    id: z.string(),
    name: z.string(),
    brand: z.string(),
    title: z.string(),
    imageUrl: z.string(),
    quantity: z.number(),
    creationDate: z.string(),
    life_time: z.string(),
    category: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string()
    }),
    price: Price,
    subCategory: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string()
    }),
    rayon: z.string(),
    unity: z.string(),
    dateEncoreFraiche: z.string(),
    dateFraiche: z.string(),
    dateAConsommerBientot: z.string(),
    type: z.enum(['urgente', 'exigée', 'souhaitable'])
})

export const FilterSchemaProductDlc = z.object({
    condition: z.string(),
    expiryDate: z.date().nullable(),
    city: z.string().optional(),
    zone: z.string().optional(),
    rayon: z.string().optional(),
    organization_id: z.string().optional(),
    responsible_id: z.string().optional(),
    category: z.object({
        id: z.string().optional(),
        name: z.string().optional()
    }).optional(),
    order: z.string().optional(),
    quantity: z.string().optional()
})

export const defaultProductSchemaDlc = {
    condition: '',
    expiryDate: null,
    organization_id: '', 
    responsible_id: '',
    city: '',
    zone: '',
    rayon: '',
    category: {
        id: '',
        name: '',
    },
    order: '',
    quantity: ''
}

// export const ProductStatusSchema = z.object({
//     urgent: z.object({
//         reduction: z.number().min(0).max(100),
//         days: z.number().min(1),
//     }),
//     required: z.object({
//         reduction: z.number().min(0).max(100),
//         days: z.number().min(1),
//     }),
//     desirable: z.object({
//         reduction: z.number().min(0).max(100),
//         days: z.number().min(1),
//     }),
// })
