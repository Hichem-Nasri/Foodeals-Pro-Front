import React, { FC } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormField } from '@/components/ui/form'
import SelectDate from '@/components/filters/SelectDate'
import { PaymentFilterSchema } from '@/types/payment-types'
import SelectParnter from './SelectPartners'
import { ListFilter } from 'lucide-react'
import { usePaymentsTranslations } from '@/hooks/useTranslations'

interface FormFilterPaymentProps {
    form: UseFormReturn<z.infer<typeof PaymentFilterSchema>>
    onSubmit: (data: z.infer<typeof PaymentFilterSchema>) => void
    onBlurMode?: 'onBlur' | 'onChange'
    dateForm?: string
    type?: string
    id?: string
    typePartner?:
        | 'PARTNER_SB,NORMAL_PARTNER'
        | 'PARTNER_SB'
        | 'NORMAL_PARTNER'
        | 'SUB_ENTITY'
    state?: 'commissions' | 'subscriptions'
}

export const FormFilterPayment: FC<FormFilterPaymentProps> = ({
    form,
    onSubmit,
    onBlurMode = 'onBlur',
    dateForm = 'MM/YYYY',
    type,
    typePartner = 'PARTNER_SB,NORMAL_PARTNER',
    id,
    state = 'commissions',
}) => {
    const { handleSubmit, control } = form
    const t = usePaymentsTranslations()

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex w-full flex-col items-start gap-3 rounded-[14px] bg-white p-4'
            >
                <div className='flex items-center justify-start gap-2'>
                    <div className='flex size-11 items-center justify-center rounded-full bg-lynch-400 p-1 text-white'>
                        <ListFilter size={28} />
                    </div>
                    <h1 className='text-lg font-[500px] text-lynch-950'>
                        {t('monthlyPaymentsStatus')}
                    </h1>
                </div>
                <div className='flex w-full flex-grow flex-col items-end gap-2 lg:flex-row'>
                    <FormField
                        control={control}
                        name={'date'}
                        render={({ field }) => (
                            <SelectDate
                                onChange={(value) => {
                                    field.onChange(value)
                                    if (onBlurMode === 'onChange') {
                                        handleSubmit(onSubmit)()
                                    }
                                }}
                                label={t('month')}
                                format={dateForm}
                                placeholder={t('selectDate')}
                                value={field.value!}
                                type={type}
                                id={id}
                            />
                        )}
                    />
                    <SelectParnter
                        control={control}
                        name='partner'
                        label={t('store')}
                        disabled={false}
                        onBlurMode={onBlurMode}
                        type={typePartner}
                        handleChange={() => handleSubmit(onSubmit)()}
                        id={id}
                        state={state}
                    />
                </div>
            </form>
        </Form>
    )
}
