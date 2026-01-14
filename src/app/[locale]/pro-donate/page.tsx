import RecoveryDonate from '@/containers/donate/home'
import { Metadata } from 'next'
import React from 'react'

interface RecoveryPageProps {}

export const metadata: Metadata = {
  title: 'Récupération - Foodeals Donate Pro',
  description: 'Récupération - Foodeals PRO Donate',
  icons: ['/favicon/donate.svg', '/favicon/favicon.svg'],
}

const RecoveryPage: React.FC<RecoveryPageProps> = () => {
  return <RecoveryDonate />
}

export default RecoveryPage
