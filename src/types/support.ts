import { z } from 'zod'
import { ContactType, PartnerInfoDto } from './GlobalType'
import { SupportSchema } from '@/schemas/support-schema'

type ContactWithAvatarType = ContactType & {
    avatarPath: string
}

export type SupportType = z.infer<typeof SupportSchema> & {
    creationDate: string
    id: string
    sender: {
        id: string | number
        avatarPath: string | null
        name: ContactType["name"]
        role: {
            id: string,
            name: string
            authorities: any
        }
        email: string
        phone: string
    }
}

// {
//     "typeRequest": 1,
//     "userId" :3,
//     "subEntityId": "c8d1ff39-8bc4-4b9b-9029-a04157fd9deb",
//     "organizationEntityId" :"0a6e6cf1-62a0-4bd7-88d2-baefed995eca",
//     "title": "Réclamation retrait produit",
//     "content": "Je reclame la retrait d'un produit."
//   }
