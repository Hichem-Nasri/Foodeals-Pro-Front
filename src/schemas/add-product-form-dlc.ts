import { z } from 'zod'

export const AddProductDlcSchema = z.object({
    expiryDate: z
        .date()
        .min(new Date(), 'Veuillez sélectionner une date valide')
        .nullable(),
    product_id: z.string().min(1, 'Veuillez sélectionner un produit'),
    bar_code: z.string().optional().nullable(),
    quantity: z.string().min(1, 'Veuillez saisir une quantité'),
})

export const DefaultAddProductDlc = {
    expiryDate: null,
    product_id: '',
    bar_code: '',
    quantity: '',
}
