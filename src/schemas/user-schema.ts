import { z } from 'zod'

export const OrganizationSchema = z.object({
    id: z.string(),
    name: z.string(),
    avatarPath: z.union([z.instanceof(File), z.string()]),
})
export type Organization = z.infer<typeof OrganizationSchema>

export const OrganizationInfoSchema = z.object({
    organization: OrganizationSchema,
    subentity: OrganizationSchema,
    rayon: z.string(),
    manager: z.string(),
    city: z.string(),
    region: z.string(),
    solutions: z.array(z.string()),
    phone: z.string(),
    email: z.string(),
})

export const WorkingHourSchema = z.object({
    selected: z.boolean().default(true),
    dayOfWeek: z.string(),
    morningStart: z
        .string()
        .default('08h')
        .transform((val) => val.replace('h', ':00')),
    morningEnd: z
        .string()
        .default('12h')
        .transform((val) => val.replace('h', ':00')),
    afternoonStart: z
        .string()
        .default('14h')
        .transform((val) => val.replace('h', ':00')),
    afternoonEnd: z
        .string()
        .default('18h')
        .transform((val) => val.replace('h', ':00')),
})

export type WorkingHourType = z.infer<typeof WorkingHourSchema>

export const CollaboratorDetailsSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
    }),
    avatarPath: z
        .union([z.instanceof(File), z.string().min(1, 'Avatar is required')])
        .refine((value) => {
            if (value instanceof File) {
                return value.size < 1000000
            }
            return true
        }),
    email: z.string().min(1, 'Email is required'),
    phone: z.string().min(1, 'Phone is required'),
    roleId: z.string().min(1, 'Role is required'),
    subEntityId: z.string().min(1, 'Subentity is required'),
    organizationEntityId: z.string().optional(),
    coveredZonesIds: z.array(z.string()).optional(),
    civility: z.string().min(1, 'Civility is required'),
    cin: z.string().min(1, 'CIN is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    cityId: z.string().min(1, 'City is required'),
    regionId: z.string().min(1, 'Region is required'),
    managerId: z.string().min(1, 'Manager is required'),
    rayon: z.string().min(1, 'Rayon is required'),
    solutionNames: z
        .array(z.string())
        .min(1, 'Selectionne au moins une solution'),
    organizationInfo: OrganizationInfoSchema.optional(),
    address: z.string().min(1, 'Address is required'),
    status: z.enum(['ACTIVE', 'IN_ACTIVE']).default('IN_ACTIVE').optional(),
    workingHours: z.object({
        Monday: WorkingHourSchema,
        Tuesday: WorkingHourSchema,
        Wednesday: WorkingHourSchema,
        Thursday: WorkingHourSchema,
        Friday: WorkingHourSchema,
        Saturday: WorkingHourSchema,
        Sunday: WorkingHourSchema,
    }),
})

export type CollaboratorDetailsType = z.infer<typeof CollaboratorDetailsSchema>

export const defaultCollaboratorDetails: CollaboratorDetailsType = {
    id: '',
    name: {
        firstName: '',
        lastName: '',
    },
    // status: 'INACTIVE',
    avatarPath: '',
    email: '',
    phone: '',
    roleId: '',
    subEntityId: '',
    organizationEntityId: '',
    coveredZonesIds: [],
    civility: '',
    cin: '',
    nationality: '',
    cityId: '',
    regionId: '',
    managerId: '',
    rayon: '',
    address: '',
    solutionNames: [],
    organizationInfo: {
        organization: {
            id: '',
            name: '',
            avatarPath: '',
        },
        subentity: {
            id: '',
            name: '',
            avatarPath: '',
        },
        rayon: '',
        manager: '',
        city: '',
        region: '',
        solutions: [],
        phone: '',
        email: '',
    },
    workingHours: {
        Monday: {
            selected: true,
            dayOfWeek: 'Monday',
            morningStart: '08h',
            morningEnd: '12h',
            afternoonStart: '14h',
            afternoonEnd: '18h',
        },
        Tuesday: {
            selected: true,
            dayOfWeek: 'Tuesday',
            morningStart: '08h',
            morningEnd: '12h',
            afternoonStart: '14h',
            afternoonEnd: '18h',
        },
        Wednesday: {
            selected: true,
            dayOfWeek: 'Wednesday',
            morningStart: '08h',
            morningEnd: '12h',
            afternoonStart: '14h',
            afternoonEnd: '18h',
        },
        Thursday: {
            selected: true,
            dayOfWeek: 'Thursday',
            morningStart: '08h',
            morningEnd: '12h',
            afternoonStart: '14h',
            afternoonEnd: '18h',
        },
        Friday: {
            selected: true,
            dayOfWeek: 'Friday',
            morningStart: '08h',
            morningEnd: '12h',
            afternoonStart: '14h',
            afternoonEnd: '18h',
        },
        Saturday: {
            selected: true,
            dayOfWeek: 'Saturday',
            morningStart: '08h',
            morningEnd: '12h',
            afternoonStart: '14h',
            afternoonEnd: '18h',
        },
        Sunday: {
            selected: true,
            dayOfWeek: 'Sunday',
            morningStart: '08h',
            morningEnd: '12h',
            afternoonStart: '14h',
            afternoonEnd: '18h',
        },
    },
}
