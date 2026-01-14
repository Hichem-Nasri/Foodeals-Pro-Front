'use client'
import { LoginSchema } from '@/schemas/login-schema'
import { signIn } from 'next-auth/react'

import { z } from 'zod'

export async function LogIn(data: z.infer<typeof LoginSchema>) {
    try {
        // Attempt to sign in with credentials
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        })

        // Check if the sign-in attempt was successful
        if (result?.error) {
            console.error('Login failed:', result.error)
            return { success: false, error: result.error }
        }

        // If there is no error and status is 'success', return success
        if (result?.status === 200) {
            // Here, you can access the session or user info from the result if needed
            // You can check result.session if you have configured NextAuth to return a session.
            return { success: true, user: result }
        }

        // Handle unexpected cases (e.g., when result is unexpected)
        console.error('Unexpected login result:', result)
        return { success: false, error: 'Unexpected error occurred.' }
    } catch (e) {
        console.error('An error occurred during login:', e)
        return { success: false, error: 'An unexpected error occurred.' }
    }
}
