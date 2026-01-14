import { Login } from '@/containers/auth'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account',
}
const SignInPage = () => {
  return <Login />
}

export default SignInPage
