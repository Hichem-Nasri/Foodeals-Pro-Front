'use server'

import {
  auth,
  signIn,
  signOut,
} from '@/auth'
import { LoginSchema } from '@/schemas/login-schema'
import { z } from 'zod'

export async function SignOut() {
  return signOut({
    redirectTo: '/auth/signin',
  })
}

export async function LogIn(
  data: z.infer<typeof LoginSchema>
) {
  try {
    const result = await signIn(
      'credentials',
      {
        email: data.email,
        password: data.password,
        remember: data.remember,
        redirect: false,
      }
    )
    console.log('result: ', result)
    // Check if there was an error during sign-in
    if (!result) {
      //   console.error('Login failed:', result.error)
      return {
        success: false,
        error:
          'Erreur User ou mot de passe',
        callBackUrl: '',
      }
    }
    // http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fpro-donate%2Fdonate%2Fcreate
    // get the callbackUrl
    // const callBackUrl = result.findIndex('callbackUrl')
    // If successful, return the user session or user info
    return {
      success: true,
      user: result.user,
    } // Assuming result.user contains user info
  } catch (e) {
    // console.error('An error occurred during login:', e)
    return {
      success: false,
      error:
        'Erreur lors de la connexion',
    }
  }
}

// export async function SetUserContext(userData: User) {
//     const { setUser, user } = useUser()
//     if (!user) {
//         setUser(userData)
//     }
// }

export async function getUser() {
  const session = await auth()
  return session?.user || null
}

export async function getAccessToken() {
  const session = await auth()
  return session?.accessToken || null
}

export async function getSession() {
  return auth()
}
