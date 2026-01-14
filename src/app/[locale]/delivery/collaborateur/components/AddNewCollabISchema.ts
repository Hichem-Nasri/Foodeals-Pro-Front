import { WeekDays } from '@/types/collaboratorsUtils'
import * as z from 'zod'
const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

export const AddCollabFormSchema = z.object({
    avatarPath: z.union(
        [
            z.instanceof(File),
            z.string().min(1, {
                message: "L'image de profil est requise",
            }),
        ],
        {
            message: "L'image de profil est requise",
        }
    ),
    civility: z.string().min(1, { message: 'La civilité est requise.' }),

    firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
    lastName: z.string().min(1, { message: 'Le nom est requis.' }),

    nationality: z.string().min(1, { message: 'La nationalité est requise.' }),
    cin: z
        .string()
        .min(1, { message: 'Le CIN est requis.' })
        .length(8, 'Le CIN doit comporter 8 caractères.'),
    role: z.string().min(1, { message: 'Le rôle est requis.' }),
    phone: z
        .string()
        .min(1, { message: 'Le téléphone est requis.' })
        .regex(phoneRegex, 'Numéro de téléphone invalide.'),
    email: z
        .string()
        .min(1, { message: "L'Email est requis." })
        .email('Veuillez fournir un email valide.'),
    city: z.string().min(1, { message: 'La ville est requise.' }),
    address: z.string().min(1, { message: "L'adresse est requise." }),
    manager: z
        .string()
        // .min(1, { message: 'Le responsable est requis.' })
        .optional(),
    // // solution: z.string().min(1, { message: 'La solution est requise.' }),
    solution: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: 'Vous devez choisir au moins une zone de couverture.',
        }),
    zone: z
        .array(z.string())
        .refine((value) => new Set(value).size === value.length),
    workSchedules: z.array(
        z.object({
            // day: z.string(),
            day: z.enum(Object.values(WeekDays) as [WeekDays, ...WeekDays[]]),
            enabled: z.boolean(),
            morning: z
                .object({
                    start: z
                        .string()
                        .transform((val) => val.replace('h', ':00')),
                    end: z.string().transform((val) => val.replace('h', ':00')),
                })
                .optional(),
            afternoon: z
                .object({
                    start: z
                        .string()
                        .transform((val) => val.replace('h', ':00')),
                    end: z.string().transform((val) => val.replace('h', ':00')),
                })
                .optional(),
        })
    ),
})

export type AddCollabFormType = z.infer<typeof AddCollabFormSchema>

export const horaire_fields = {
    days: Object.values(WeekDays).map((day) => ({
        day,
        morning: {
            type: 'time',
            label: `Horaire (matin)`,
        },
        afternoon: {
            type: 'time',
            label: `Horaire (après-midi)`,
        },
        enabled: {
            type: 'toggle',
            label: `Activer ${day}`,
        },
    })),
}

export const addCollabFormDefaultValues: AddCollabFormType = {
    avatarPath: '',
    firstName: '',
    lastName: '',
    civility: '',
    address: '',
    cin: '',
    city: '',
    email: '',
    nationality: '',
    phone: '',
    role: '',
    manager: '',
    solution: [],
    zone: [],
    workSchedules: horaire_fields.days.map((data) => ({
        day: data.day,
        morning: { start: '', end: '' },
        afternoon: { start: '', end: '' },
        enabled: false,
    })),
}

export const testCollaborator: AddCollabFormType = {
    avatarPath: '/images/user-face-placeholder.png', // Example avatar URL
    firstName: 'Jean',
    lastName: 'Dupont',
    civility: 'Monsieur', // Example: Monsieur, Madame, etc.
    address: '123 Rue de Paris, 75001 Paris, France',
    cin: 'AB123456',
    city: 'Paris',
    email: 'jean.dupont@example.com',
    nationality: 'Française',
    phone: '+33 6 12 34 56 78',
    role: 'Développeur',
    manager: 'Marie Curie', // Example responsible person
    solution: ['pro_market', 'pro_donate', 'dlc'], // Example solutions
    zone: ['Zone 1', 'Zone 2'], // Example zones
    workSchedules: [
        {
            day: WeekDays.Monday,
            morning: { start: '08:00', end: '12:00' },
            afternoon: { start: '14:00', end: '18:00' },
            enabled: true,
        },
        {
            day: WeekDays.Tuesday,
            morning: { start: '08:30', end: '12:30' },
            afternoon: { start: '14:30', end: '18:30' },
            enabled: true,
        },
        {
            day: WeekDays.Wednesday,
            morning: { start: '09:00', end: '13:00' },
            afternoon: { start: '15:00', end: '19:00' },
            enabled: true,
        },
        {
            day: WeekDays.Thursday,
            morning: { start: '08:00', end: '12:00' },
            afternoon: { start: '14:00', end: '18:00' },
            enabled: true,
        },
        {
            day: WeekDays.Friday,
            morning: { start: '08:00', end: '12:00' },
            afternoon: { start: '14:00', end: '17:00' },
            enabled: true,
        },
        {
            day: WeekDays.Saturday,
            morning: { start: '10:00', end: '13:00' },
            afternoon: { start: '', end: '' },
            enabled: false,
        },
        {
            day: WeekDays.Sunday,
            morning: { start: '', end: '' },
            afternoon: { start: '', end: '' },
            enabled: false,
        },
    ],
}

export type WorkScheduleType = {
    dayOfWeek: WeekDays
    morningStart: string | undefined
    morningEnd: string | undefined
    afternoonStart: string | undefined
    afternoonEnd: string | undefined
}

export type PostNewCollabApiShapeType = {
    collaborator: {
        name: {
            firstName: string
            lastName: string
        }
        email: string
        phone: string
        roleId: string
        subEntityId: null
        civility: string
        cin: string
        nationality: string
        cityId: string
        managerId: string | undefined
        rayon: string
        solutionNames: string[]
        address: string
        isEmailVerified: boolean
        organizationEntityId: null
        coveredZonesIds: null
        password: null
        workSchedules: WorkScheduleType[]
        avatarPath: null
    }
    profilImage: string | File | undefined
}
