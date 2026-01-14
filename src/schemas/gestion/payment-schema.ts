import { z } from 'zod'

export const PaymentFiltersSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    partner: z.string().optional(),
    paymentMethod: z.string().optional(),
    commissionMethod: z.string().optional(),
	status: z.string().optional(),
})


export const defaultPaymentFiltersSchema = {
	startDate: "",
	endDate: "",
	partner: "",
	paymentMethod: "",
	commissionMethod: "",
	status: "",
}
