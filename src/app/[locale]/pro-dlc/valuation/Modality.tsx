import { Truck, CreditCard } from 'lucide-react'
import React from 'react'
import { useValuationTranslations } from '@/hooks/useTranslations'

interface modalityProps {}

const Modality: React.FC<modalityProps> = () => {
  const t = useValuationTranslations()
  
  return (
    <div className='m-auto w-full rounded-[30px] bg-white p-4'>
      <div className='flex gap-4'>
        <div className='flex w-full flex-1 flex-col items-start justify-between rounded-xl'>
          <h4 className='font-montserrat mb-4 text-[14px] font-semibold leading-[12.19px] text-black'>
            {t('modality.title')}
          </h4>
          <div className='flex w-full items-center gap-2 rounded-xl border border-[#D5D9E2] p-2'>
            <Truck size={24} className='text-[#64748B]' />
            <span className='font-montserrat text-sm font-semibold leading-[14.63px] text-[#64748B]'>
              {t('modality.delivery')}
            </span>
          </div>
        </div>

        <div className='flex w-full flex-1 flex-col items-start justify-between rounded-xl'>
          <h4 className='font-montserrat mb-4 text-[14px] font-semibold leading-[12.19px] text-black'>
            {t('modality.payment')}
          </h4>
          <div className='flex w-full items-center justify-start gap-2 rounded-xl border border-[#D5D9E2] p-2'>
            <CreditCard size={24} className='text-[#64748B]' />
            <span className='font-montserrat self-center text-sm font-semibold leading-[14.63px] text-[#64748B]'>
              {t('modality.byCard')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modality
