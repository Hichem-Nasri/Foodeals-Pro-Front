'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import TopTabs, { Tab } from '@/components/custom/TopTabs'
import SideButton from '@/containers/market/components/SideButton'
import { Archive, ListFilter } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useOffersTranslations } from '@/hooks/useTranslations'

export default function OffersTabs() {
  const t = useOffersTranslations()
  
  const tabs: Tab[] = [
    { label: t('tabs.deals'), query: 'deals' },
    { label: t('tabs.boxNormal'), query: 'box_normal' },
    { label: t('tabs.boxSurprise'), query: 'box_surprise' },
  ]
  
  const searchParams = useSearchParams()
  const [searchPrams, setSearchPrams] = React.useState<string | null>('deals')
  
  React.useEffect(() => {
    const search = searchParams?.get('tab')
    if (search) {
      setSearchPrams(search)
    }
  }, [searchParams])
  const [image, setImage] = React.useState(false)
  const [sheet, setSheet] = React.useState(false)
  return (
    <div className='flex w-full flex-col items-center justify-between rounded-[18px] bg-transparent p-2 lg:flex-row lg:bg-white'>
      <div className='flex w-full gap-3'>
        <TopTabs
          tabs={tabs}
          activeColor='green'
          selectedTab={searchPrams || 'deals'}
        />
      </div>
      <div className='hidden items-center justify-end gap-3 lg:flex'>
        <SideButton
          setImage={() => {}}
          setSheet={() => {}}
          image={false}
          sheet={false}
        />
      </div>
    </div>
  )
}
