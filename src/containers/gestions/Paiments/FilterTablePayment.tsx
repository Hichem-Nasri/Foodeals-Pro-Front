import { FC } from 'react'
import { ChevronLeft, ListFilter, X } from 'lucide-react'
import { FormFilterPayment } from './FormFilterPayment'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'
import React from 'react'
import { PaymentFilterSchema } from '@/types/payment-types'
import DrawerFilterPayment from './partenaire-business/commissions/DrawerFilterPayment'
import { usePaymentsTranslations } from '@/hooks/useTranslations'

interface FilterTablePaymentProps {
    form: UseFormReturn<z.infer<typeof PaymentFilterSchema>>
    onSubmit: (data: any) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    header?: string
    dateForm?: string
    type?: string
    typePartner?:
        | 'PARTNER_SB,NORMAL_PARTNER'
        | 'PARTNER_SB'
        | 'NORMAL_PARTNER'
        | 'SUB_ENTITY'
    id?: string
    state: 'commissions' | 'subscriptions'
}

export const FilterTablePayment: FC<FilterTablePaymentProps> = ({
    form,
    onSubmit,
    setOpen,
    header,
    dateForm,
    type,
    typePartner,
    id,
    state = 'commissions',
}) => {
    // dialog that take all the page and show the filter form with buttons in bottom of the page
    const t = usePaymentsTranslations()

    return (
        <div className='w-full lg:max-w-xl'>
            <div className='min- flex w-full items-center justify-between gap-3 rounded-full border-0 border-lynch-200 p-4 text-sm font-medium text-lynch-500 lg:hidden lg:rounded-[12px] lg:border'>
                <span className='text-lg text-lynch-950'>
                    {header ? header : t('commissionValidationTable')}
                </span>
                <DrawerFilterPayment onSubmit={onSubmit} />
            </div>

            <div className='hidden w-full lg:flex'>
                <FormFilterPayment
                    form={form}
                    onSubmit={onSubmit}
                    onBlurMode='onChange'
                    dateForm={dateForm}
                    type={type}
                    typePartner={typePartner}
                    id={id}
                    state={state}
                />
            </div>
        </div>
    )
}
