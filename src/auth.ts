import NextAuth, { NextAuthConfig } from 'next-auth'
import authConfig from './auth.config'
import axios from 'axios'
import { Roles } from './types/GlobalType'
import { NextResponse } from 'next/server'

const protectedRoutes = [{ path: '/delivery', roles: [Roles.DELIVERY_MAN] }]

const config: NextAuthConfig = {
  ...authConfig,
  callbacks: {
    authorized: async ({ auth, request }) => {
      try {
        const { pathname } = request.nextUrl

        // Handle unauthenticated users
        if (!auth && pathname !== '/auth/signin') {
          return NextResponse.redirect(new URL('/auth/signin', request.url))
        }

        // Handle authenticated users
        if (auth) {
          // Token verification
          if (auth.accessToken) {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/verify-token`,
              { token: auth.accessToken }
            )
            if (!res.data) return false
          }

          // Redirect away from sign-in page
          if (pathname === '/auth/signin') {
            return NextResponse.redirect(new URL('/', request.url))
          }
          console.log('token: ', auth.accessToken)
          // Role-based path enforcement
          const userRole = auth.user?.role
          const requiredRoute = protectedRoutes.find((route) =>
            route.roles.includes(userRole!)
          )

          if (requiredRoute && !pathname.startsWith(requiredRoute.path)) {
            return NextResponse.redirect(
              new URL(requiredRoute.path, request.url)
            )
          }
        }

        return true
      } catch (error) {
        console.error('Authorization error:', error)
        return false
      }
    },
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.accessToken = user.accessToken || ''
        token.id = user.id || ''
        token.role = user.role || ''
        token.image = user.image || ''
        token.email = user.email || ''
        token.phone = user.phone || ''
        token.organizationId = user.organizationId || ''
        token.solutions = user.solutions || []
      }
      return token
    },
    session: async ({ session, token }) => {
      // Add access_token to the session right after signin

      session.accessToken = token.accessToken
      session.user.id = token.id || ''
      session.user.role = token.role || ''
      session.user.image = token.image || ''
      session.user.email = token.email || ''
      session.user.phone = token.phone || ''
      session.user.organizationId = token.organizationId || ''
      session.user.solutions = token.solutions || []
      return session
    },
    redirect: async ({ url, baseUrl }) => {
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  trustHost: true,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
  },
}

export const { auth, signIn, signOut, handlers } = NextAuth(config)
