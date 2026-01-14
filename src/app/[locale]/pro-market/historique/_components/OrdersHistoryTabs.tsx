'use client'
import TopTabs, { Tab } from '@/components/custom/TopTabs'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useHistoriqueTranslations } from '@/hooks/useTranslations'

export default function OrdersHistoryTabs() {
  const t = useHistoriqueTranslations()
  const searchParams = useSearchParams()
  
  const tabs: Tab[] = [
    { label: t('tabs.delivered'), query: 'delivered' },
    { label: t('tabs.cancelled'), query: 'canceled' },
  ]
  
  const [searchPramsTab, setSearchPramsTab] = useState<string | null>(
    'delivered'
  )
  
  useEffect(() => {
    const search = searchParams?.get('tab')
    if (search) {
      setSearchPramsTab(search)
    }
  }, [searchParams])

  return (
    <TopTabs
      tabs={tabs}
      activeColor='green'
      selectedTab={searchPramsTab || 'delivered'}
    />
  )
}
