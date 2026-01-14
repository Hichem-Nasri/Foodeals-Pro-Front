import { Layout } from '@/components/layout/Layout'
import CommissionMonth from '@/containers/gestions/Paiments/partenaire-business/commissions/operation-month/commissionMonth'
import React from 'react'

interface pageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    type: string
  }>
}

const page: React.FC<
  pageProps
> = async ({
  params,
  searchParams,
}) => {
  const { id } = React.use(params)
  const { type } = React.use(
    searchParams
  )
  return (
    <Layout formTitle='Details'>
      <CommissionMonth
        id={id}
        type={
          type as
            | 'NORMAL_PARTNER'
            | 'SUB_ENTITY'
        }
      />
    </Layout>
  )
}

export default page
