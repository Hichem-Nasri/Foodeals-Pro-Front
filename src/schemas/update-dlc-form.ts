// src/schemas/update-dlc-form.ts
import { z } from "zod"

export const UpdateDlcFormSchema = z.object({
    expiryDate: z.date().nullable(),
    quantity: z.string()
})

export const DefaultUpdateDlcForm = {
    expiryDate: null,
    quantity: ''
}

export type UpdateDlcFormType = z.infer<typeof UpdateDlcFormSchema>