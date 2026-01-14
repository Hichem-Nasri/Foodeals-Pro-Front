import { Layout } from '@/components/layout/Layout'
import React from 'react'
import DlcHistory from '.'
import MobileHeader from '@/components/utils/MobileHeader'

interface HistoryUserDlcPageProps {
  params: Promise<{
    detail_id: string
    history_id: string
  }>
}

const HistoryUserDlcPage: React.FC<
  HistoryUserDlcPageProps
> = async ({ params }) => {
  const { detail_id, history_id } =
    await params
  return (
    <>
      <MobileHeader header='Historique' />
      <DlcHistory
        userId={history_id}
        dlcId={detail_id}
      />
    </>
  )
}

export default HistoryUserDlcPage
