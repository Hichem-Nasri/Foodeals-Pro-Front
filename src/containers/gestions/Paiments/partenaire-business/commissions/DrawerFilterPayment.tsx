import { CustomButton } from '@/components/custom/CustomButton'
import { SelectField } from '@/components/custom/SelectField'
import { DatePicker } from '@/components/tools/DatePicker'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'
import { usePaymentsTranslations } from '@/hooks/useTranslations'
import {
  PaymentFiltersSchema,
  defaultPaymentFiltersSchema,
} from '@/schemas/gestion/payment-schema'
import { PaymentFilterSchema } from '@/types/payment-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck, ListFilter, X } from 'lucide-react'
import React from 'react'
import { Button } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import SelectParnter from '../../SelectPartners'
import { Select } from '@radix-ui/react-select'
import { DateFilter } from '@/components/filters/DateFilters'

interface DrawerFilterPaymentProps {
  onSubmit: (data: any) => void
}

const DrawerFilterPayment: React.FC<DrawerFilterPaymentProps> = ({
  onSubmit,
}) => {
  const t = usePaymentsTranslations()
  const form = useForm({
    resolver: zodResolver(PaymentFiltersSchema),
    defaultValues: defaultPaymentFiltersSchema,
    mode: 'onBlur',
  })
  const { control, handleSubmit } = form
  return (
    <Drawer>
      <DrawerTrigger className='flex w-fit cursor-pointer items-center justify-center rounded-full bg-white p-3 text-lynch-500'>
        <ListFilter />
      </DrawerTrigger>
      <DrawerContent className='p-2'>
        <DrawerHeader>
          <DrawerTitle>{t('filter')}</DrawerTitle>
          <DrawerDescription>
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex w-full flex-col items-start gap-3 rounded-[14px] bg-white p-4'
              >
                <DateFilter form={form} disabled={false} />
                <SelectParnter
                  name='partner'
                  label={t('byPartner')}
                  control={control}
                  state='commissions'
                  type='PARTNER'
                />
                <SelectField
                  options={['Carte', 'Cash'].map((val) => ({
                    key: val,
                    label: val == 'Cash' ? t('cash') : val,
                  }))}
                  control={control}
                  name='paymentMethod'
                  label={t('paymentBy')}
                />
                <SelectField
                  options={['Carte', 'Cash'].map((val) => ({
                    key: val,
                    label: val == 'Cash' ? t('cash') : val,
                  }))}
                  control={control}
                  name='commissionMethod'
                  label={t('paymentBy')}
                />
                <SelectField
                  options={[
                    { key: 'Valider', label: t('validated') },
                    { key: 'En attente', label: t('pending') },
                    { key: 'Annuler', label: t('canceled') }
                  ]}
                  control={control}
                  name='status'
                  label={t('status')}
                />
              </form>
            </Form>
          </DrawerDescription>
          <DrawerClose className='flex w-full items-center justify-between gap-2'>
            <CustomButton
              variant='outline'
              type='button'
              label={t('close')}
              onClick={() => {}}
              IconRight={X}
              className='w-full'
            />
            <CustomButton
              variant='default'
              type='submit'
              label={t('confirm')}
              IconRight={CircleCheck}
              className='w-full'
            />
          </DrawerClose>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerFilterPayment
