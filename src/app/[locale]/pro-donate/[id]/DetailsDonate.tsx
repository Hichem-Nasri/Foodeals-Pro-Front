'use client'
import MobileHeader from '@/components/utils/MobileHeader'
import DonateDetails, {
  RecoveryDetailsT,
} from '@/containers/donate/home/details'
import DetailsProductRecovery from '@/containers/donate/home/details/DetailsProductRecovery'
import { PaymentMethodEnum } from '@/types/GlobalType'
import React, { useEffect } from 'react'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface DetailsDonateProps {
  data: RecoveryDetailsT
}

const DetailsDonate: React.FC<DetailsDonateProps> = ({ data }) => {
  return (
    <>
      <DonateDetails {...data} />
    </>
  )
}

export default DetailsDonate
