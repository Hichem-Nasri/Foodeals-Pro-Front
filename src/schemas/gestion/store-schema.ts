import { z } from 'zod'

// "name": "Marjane Gourmet",
// "activiteNames": [ "SUPERMARCHE",
//                 "SUPERETTES"],
// "avatarPath": null,
// "coverPath": null,
// "solutionNames": [
//   "pro_donate",
//   "dlc",
//   "pro_market"
// ],
// "organizationEntityId" :"d7be605f-6a3f-4b48-a1d9-bae6711e8955",
// "managerId": 1,
// "cityId": "c29b34da-d2fd-423e-9ce2-8278d6a4ab84",
// "regionId": "0ac46ed5-0745-4840-8ceb-568937b4d959",
// "countryId": "0d78dfeb-228a-4750-bfb1-d4950df71965",
// "exactAdresse": "BD el Qods, Rue 12, Californie, 205",
// "iFrame":"<iframe src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d106373.80872746315!2d-7.860868!3d33.5746359!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62d3b8e81690d%3A0xb2f7bc0e40016ff2!2sMarjane%20Californie!5e0!3m2!1sfr!2sfr!4v1728226896269!5m2!1sfr!2sfr' width='600' height='450' style='border:0;' allowfullscreen='' loading='lazy' referrerpolicy='no-referrer-when-downgrade'></iframe>"
export const StoreSchema = z.object({
    avatarPath: z
        .union([z.string(), z.instanceof(File)])
        .refine((value) => value !== '', {
            message: 'Avatar path cannot be empty',
        }),
    coverPath: z
        .union([z.string(), z.instanceof(File)])
        .refine((value) => value !== '', {
            message: 'Cover path cannot be empty',
        }),
    name: z.string().min(3),
    activiteNames: z
        .array(z.string())
        .min(1, 'Veuillez sélectionner au moins une activité'),
    managerId: z.string().optional(), //.min(1, 'Veuillez sélectionner un responsable'),
    managerData: z
        .object({
            id: z.string().optional(),
            name: z.string().optional(),
            phone: z.string().optional(),
            email: z.string().optional(),
            avatarPath: z.string().optional(),
            role: z.string().optional(),
        })
        .optional(),
    solutionNames: z
        .array(z.string())
        .min(1, 'Veuillez sélectionner au moins une solution'),
    phone: z
        .string()
        .min(9, 'Le numéro de téléphone doit contenir au moins 9 chiffres')
        .refine((value) => /^[\d+]+$/.test(value), {
            message: 'Le numéro de téléphone ne doit contenir que des chiffres',
        }),
    email: z.string().email('Veuillez entrer une adresse email valide'),
    countryId: z.string().min(3),
    cityId: z.string().min(3),
    regionId: z.string().min(3),
    exactAdresse: z.string().min(3),
    iFrame: z.string().optional(),
    status: z.enum(['ACTIVE', 'IN_ACTIVE']).default('IN_ACTIVE').optional(),
})

export type StoreType = z.infer<typeof StoreSchema>

export const FilterStoreSchema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    store: z.string().optional(),
    type: z.string().optional(),
    responsible: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
})

export const defaultFilterStoreSchema = {
    startDate: '',
    endDate: '',
    store: '',
    type: '',
    responsible: '',
    phone: '',
    email: '',
    city: '',
    region: '',
}
