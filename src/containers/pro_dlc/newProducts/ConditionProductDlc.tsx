'use client'

import { CustomButton } from '@/components/custom/CustomButton'
import { AppRoutes } from '@/lib/routes'
import { CalendarClock, LoaderCircle, PencilLine } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import DLCProduct from '@/types/DlcProduct'

const GetCondition = (str: string) => {
  switch (str) {
    case 'Valorisation urgente':
      return { text: 'A consommer bientôt', className: 'text-coral-500' }
    case 'Valorisation exigée':
      return { text: 'Valorisation exigée', className: 'text-tulip-500' }
    default:
      return {
        text: 'Valorisation souhaitable',
        className: 'text-primary',
      }
  }
}

const formatDate = (date: string): number => {
  const today = new Date()
  const targetDate = new Date(date)
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const ConditionProductsDLC = ({
  id,
  product,
}: {
  id?: string
  product?: DLCProduct
}) => {
  // const conditions = [
  //     {
  //         date: product.dateEncoreFraiche,
  //         percentage: product.prgEncoreFraiche,
  //         text: 'Encore Fraiche'
  //     },
  //     {
  //         date: product.dateFraiche,
  //         percentage: product.prgFraiche,
  //         text: 'Fraiche'
  //     },
  //     {
  //         date: product.dateAConsommerBientot,
  //         percentage: product.prgAConsommerBientot,
  //         text: 'A consommer bientôt'
  //     }
  // ]

  const conditions = [
    {
      date: product?.dateEncoreFraiche,
      percentage: product?.prgEncoreFraiche,
      text: 'Valorisation souhaitable',
    },
    {
      date: product?.dateFraiche,
      percentage: product?.prgFraiche,
      text: 'Valorisation exigée',
    },
    {
      date: product?.dateAConsommerBientot,
      percentage: product?.prgAConsommerBientot,
      text: 'Valorisation urgente',
    },
  ]

  return (
    <div className='flex w-full flex-col items-start justify-center gap-4 rounded-[24px] bg-white p-4'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-lg font-bold'>Condition du retrait</h1>
        <Link href={AppRoutes.settings + `?product=${id}`}>
          <CustomButton
            label=''
            size='sm'
            className='flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#FAC215] text-white hover:bg-[#FAC215] [&>.icon]:ml-0'
            IconRight={PencilLine}
          />
        </Link>
      </div>
      <div className='flex w-full flex-col items-center justify-center gap-4 px-2'>
        {conditions.map((item, index) => {
          const { text, className } = GetCondition(item.text)
          return (
            <>
              <div
                key={index}
                className='flex w-full flex-col items-start justify-center space-y-2'
              >
                <h1 className={`${className} text-lg font-semibold`}>{text}</h1>
                <h2 className='text-sm font-normal text-lynch-950'>
                  Condition de retrait
                </h2>
                <div className='inline-flex gap-[30px]'>
                  <div className='flex items-center justify-center space-x-1 text-lynch-500'>
                    <CalendarClock size={24} />
                    <span className='text-sm'>
                      {`J-${formatDate(item?.date! || '')}`}
                    </span>
                  </div>
                  <div className='flex items-center justify-center space-x-1 text-lynch-500'>
                    <LoaderCircle size={24} />
                    <span className='text-sm'>{item.percentage}%</span>
                  </div>
                </div>
              </div>
              {index !== conditions.length - 1 && (
                <hr className='w-full border-lynch-200' />
              )}
            </>
          )
        })}
      </div>
    </div>
  )
}

export default ConditionProductsDLC
