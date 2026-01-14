'use client'
import { Layout } from '@/components/layout/Layout'
import React, { use } from 'react'
import Valuation from '.'
import DLCProduct from '@/types/DlcProduct'
import MyDecision from './MyDecision'
import MobileHeader from '@/components/utils/MobileHeader'
import { useValuationTranslations } from '@/hooks/useTranslations'

interface pageProps {
  searchParams: Promise<{
    show: string
  }>
}

const ValuationPage: React.FC<
  pageProps
> = ({ searchParams }) => {
  const { show } = use(searchParams)
  const t = useValuationTranslations()
  
  return (
    <>
      <MobileHeader
        header={
          show == 'ticket'
            ? t('myDecision')
            : t('title')
        }
      />
      {show == 'ticket' ? (
        <MyDecision />
      ) : (
        <Valuation />
      )}
    </>
  )
}

export default ValuationPage
