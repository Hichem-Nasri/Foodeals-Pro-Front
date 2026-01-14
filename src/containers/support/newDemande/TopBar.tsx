import { CustomButton } from '@/components/custom/CustomButton'
import { PartnerStatus } from '@/components/utils/PartnerStatus'
import { PartnerStatusType } from '@/types/GlobalType'
import { Save, Send } from 'lucide-react'
import React, { FC } from 'react'
import { useSupportTranslations } from '@/hooks/useTranslations'

interface TopBarProps {
  status: PartnerStatusType
  onSubmit: () => void
  onSaveData: () => void
  disableFirst: boolean
  disableSecond: boolean
  isLoading: boolean
}

const TopBar: FC<TopBarProps> = ({
  status,
  onSaveData,
  onSubmit,
  disableFirst,
  disableSecond,
  isLoading,
}) => {
  const t = useSupportTranslations()
  
  return (
    <>
      <div className='fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-center space-x-4 rounded-t-[18px] bg-white p-2 lg:relative lg:justify-between lg:space-x-0 lg:rounded-[18px]'>
        <div className='hidden lg:flex'>
          <PartnerStatus status={status} />
        </div>
        <div className='flex w-full justify-center gap-4 lg:w-fit'>
          <CustomButton
            disabled={disableFirst || isLoading}
            label={t('form.send').toUpperCase()}
            size={'sm'}
            IconRight={Send}
            onClick={onSaveData}
            className='w-full lg:h-12 lg:w-fit lg:rounded-xl'
          />
        </div>
      </div>
    </>
  )
}

export default TopBar
