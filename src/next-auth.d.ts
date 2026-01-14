import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'
import { Roles } from '@/types/GlobalType'

declare module 'next-auth' {
    interface Session {
        accessToken: string
        refreshToken: string
        user: {
            id: string
            name: string
            email: string
            image?: string | null
            role: Roles
            organizationId: string | null
            phone: string
            solutions: string[]
        } & DefaultSession['user']
    }

    interface User extends DefaultUser {
        accessToken: string
        refreshToken: string
        role: Roles
        solutions: string[]
        phone: string
        organizationId: string | null
        image: string | null
        email: string
        name: string
    }
}

// "name": {
//         "firstName": "Yassine",
//         "lastName": "Ben Taleb"
//     },
//     "email": "yassine.bentaleb@example.com",
//     "phone": "061",
//     "organizationEntityId": "d0ef81ac-aad1-4705-8e66-b3a438472253",
//     "solutions": [],
//     "role": "MANAGER",
//     "avatarPath": null,
//     "id": 7,
// }

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        accessToken: string
        refreshToken: string
        id: string
        role: Roles
        image: string | null
        email: string
        phone: string
        organizationId: string | null
        name: string
        solutions: string[]
    }
}
