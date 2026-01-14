import React from 'react'
import DlcDetailsPage from '.'
import { Layout } from '@/components/layout/Layout'
import MobileHeader from '@/components/utils/MobileHeader'

interface pageProps {
  params: Promise<{
    detail_id: string
  }>
}

const PageDetailsDlc: React.FC<
  pageProps
> = async ({ params }) => {
  const { detail_id } = await params
  console.log('parmas: ', detail_id)
  return (
    <>
      <MobileHeader header='Détail de la DLC' />
      <DlcDetailsPage id={detail_id} />
    </>
  )
}

export default PageDetailsDlc
