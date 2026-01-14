import DealPro from '@/containers/market/dealpro'
import React from 'react'

interface pageProps {
  params: Promise<{
    locale: string
  }>
}

const page: React.FC<pageProps> = async ({ params }) => {
  const { locale } = await params
  return <DealPro />
}

export default page
