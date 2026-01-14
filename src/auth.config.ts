import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig, User } from 'next-auth'
import { LoginSchema } from './schemas/login-schema'
import { PartnerSolutionType } from './types/GlobalType'

export default {
  // debug: true, // Will show detailed errors in development
  // logger: {
  //   error(code, ...message) {
  //     console.error(code, message)
  //   },
  //   warn: (code) => {
  //     console.warn(code)
  //   },
  //   debug: (code, metadata) => {
  //     console.debug(code, metadata)
  //   },
  // },
  providers: [
    Credentials({
      async authorize(credentials, req) {
        const validatedFields = LoginSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        })
        if (!validatedFields.success) {
          console.error('Validation error:', validatedFields.error)
          return null // Return null if validation fails
        }
        const { email, password } = validatedFields.data
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            }
          )
          if (!response.ok) {
            return null
          }

          const res = await response.json()
          const user = {
            name: `${res?.name?.firstName} ${res?.name?.lastName}`,
            role: res?.role,
            accessToken: res?.token?.access_token,
            refreshToken: res?.token?.refresh_token,
            // accessToken: res.access_token,
            // refreshToken: res.refresh_token,
            email: res.email,
            phone: res.phone,
            organizationId: res.organizationEntityId || null,
            solutions:
              (res?.solutions?.map((solution: { id: string; name: string }) =>
                solution.name == 'dlc' ? 'pro_dlc' : solution.name
              ) as PartnerSolutionType[]) || [],
            id: res.id || '1',
            image: res.avatarPath || null, // Ensure image is string or null
          }

          console.log(user)

          return user // Return the user object
        } catch (error) {
          // console.error('Authorization error:', error)
          return null // Return null on error
        }
      },
    }),
  ],
} satisfies NextAuthConfig
