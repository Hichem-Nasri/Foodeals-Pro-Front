import { z } from 'zod'
import { ContactType, PartnerSolutionType } from './GlobalType'

export type CollaboratorsType = {
    id: string
    createdAt: string
    roleName: string
    solutions: PartnerSolutionType[]
    userInfoDto: ContactType & { avatarPath: string }
}
// http://localhost:8080/v1/users/filter?startDate=<startDate>&endDate=<endDate>&collaboratorId=<collaboratorId>&role=<role>&email=<email>&phone=<phone>&solutionId=<solutionId>&page=<pageNumber>&size=<pageSize>

export const SchemaCollaborators = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    collaboratorId: z.string().optional(),
    role: z.string().optional(),
    solutions: z.array(z.string()).optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
})

export const defaultSchemaCollaborators = {
    startDate: '',
    endDate: '',
    role: '',
    collaboratorId: '',
    solutions: [],
    name: '',
    email: '',
    phone: '',
}

export enum WeekDays {
    Monday = 'MONDAY',
    Tuesday = 'TUESDAY',
    Wednesday = 'WEDNESDAY',
    Thursday = 'THURSDAY',
    Friday = 'FRIDAY',
    Saturday = 'SATURDAY',
    Sunday = 'SUNDAY',
}

export const getFrenchDay: Record<WeekDays, string> = {
    [WeekDays.Monday]: 'lundi',
    [WeekDays.Tuesday]: 'mardi',
    [WeekDays.Wednesday]: 'mercredi',
    [WeekDays.Thursday]: 'jeudi',
    [WeekDays.Friday]: 'vendredi',
    [WeekDays.Saturday]: 'samedi',
    [WeekDays.Sunday]: 'dimanche',
}
