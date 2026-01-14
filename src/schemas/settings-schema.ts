import { z } from 'zod'

export const SchemaPaymentDelivery = z.object({
    payment: z.string(),
    delivery: z.string(),
})
