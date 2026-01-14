'use client'
import { FC, ForwardRefExoticComponent, RefAttributes, useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Banknote,
  CheckCheck,
  CheckCircle,
  CreditCard,
  HandCoins,
  LucideProps,
  TicketCheck,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CustomButton } from '@/components/custom/CustomButton'
import { InputFieldForm } from '@/components/custom/InputField'
import MobileHeader from '@/components/custom/MobileHeader'
import { DatePicker } from '@/components/tools/DatePicker'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { UploadFile } from '@/components/utils/UploadFile'
import { useNotification } from '@/context/NotifContext'
import { PriceType, NotificationType } from '@/types/GlobalType'
import {
  defaultValuesPayment,
  PaymentMethod,
  paymentSchemas,
} from '@/types/payment-types'
import api from '@/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Select } from '@/components/custom/Select'
import { Label } from '@/components/custom/Label'
import { SelectField } from '@/components/custom/SelectField'
import { optionsBank } from '@/utils/utils'
import { InputWithCurrancy } from '@/components/tools/InputWithCurrancy'
import { usePaymentsTranslations } from '@/hooks/useTranslations'

interface SubscriptionPaymentProps {
  subscriptionId: string
  label: string
  disabled?: boolean
  isMobile?: boolean
  className?: string
  IconLeft?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  IconRight?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  amount: number
}

type FromPaymentCheck = {
  type: PaymentMethod
  chequeNumber: string
  bankName: string
  deadlineDate: string
  recuperationDate: string
  issuer: string
}
type FormPaymentTransfer = {
  type: PaymentMethod
}

type FormPaymentCard = {
  type: PaymentMethod
  cardHolderName: string
  last4Digits: string
}

type FormPaymentCash = {
  type: PaymentMethod
  date: string
}

type FormPayment = {
  subscriptionId: string
  paymentMethod: PaymentMethod
  amount: PriceType
  paymentDetails:
    | FromPaymentCheck
    | FormPaymentTransfer
    | FormPaymentCard
    | FormPaymentCash
  document?: File
}

const PaymentDetails = (type: PaymentMethod, data: any) => {
  switch (type) {
    case PaymentMethod.CASH:
      return {
        type,
        date: data.date,
      }
    case PaymentMethod.CARD_BANK:
      return {
        type,
        cardHolderName: data.cardHolderName,
        last4Digits: data.last4Digits,
      }
    case PaymentMethod.TRANSFER:
      return {
        type,
      }
    case PaymentMethod.CHECK:
      return {
        type,
        chequeNumber: data.checkNumber,
        bankName: data.bankCompany,
        deadlineDate: data.dateOfGet,
        recuperationDate: data.dateOfWrite,
        issuer: data.issuerName,
      }
  }
}

const getPayment = (
  subscriptionId: string,
  type: PaymentMethod,
  data: any,
  currencies: string
) => {
  const payment: FormPayment = {
    subscriptionId,
    paymentMethod: type,
    amount: {
      amount: data.amount,
      currency: currencies,
    },
    paymentDetails: PaymentDetails(type, data),
    document: data.document,
  }

  return payment
}

export const SubscriptionPayment: FC<SubscriptionPaymentProps> = ({
  disabled = false,
  subscriptionId,
  label,
  isMobile = false,
  className,
  IconLeft,
  IconRight,
  amount,
}) => {
  const t = usePaymentsTranslations()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  )
  const [currencies, setCurrencies] = useState('MAD')
  const Notif = useNotification()

  const schema = paymentSchemas[paymentMethod || PaymentMethod.CASH]
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      ...defaultValuesPayment,
      amount: amount,
    } as any,
  })

  const { mutate } = useMutation({
    mutationKey: ['subscription-payment', subscriptionId],
    mutationFn: async (data: FormPayment) => {
      try {
        const { document, ...rest } = { ...data, amount: amount }

        const formData = new FormData()
        formData.append('dto', JSON.stringify(rest))
        if (document) formData.append('document', document)
        const res = await api
          .post(`/v1/payments/process`, formData)
          .catch((e) => {
            console.error(e)
            throw new Error('Failed to process subscription payment')
          })
        if ([200, 201].includes(res.status)) {
          // Handle redirect for card payments
          if (res.data?.redirectUrl) {
            window.location.href = res.data.redirectUrl
          } else {
            Notif.notify(
              NotificationType.SUCCESS,
              'Subscription payment has been processed successfully'
            )
          }
        }
      } catch (e) {
        Notif.notify(NotificationType.ERROR, 'Error processing subscription payment')
      }
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const paymentData = getPayment(subscriptionId, paymentMethod, data, currencies)
    mutate(paymentData)
  }

  const handlePaymentChange = (value: PaymentMethod) => {
    setPaymentMethod(value)
    reset()
  }

  const { handleSubmit, control, reset } = form
  const options: MultiSelectOptionsType[] = [
    {
      key: PaymentMethod.CASH,
      label: 'Espèce',
      icon: HandCoins,
    },
    {
      key: PaymentMethod.CARD_BANK,
      label: 'Carte bancaire',
      icon: CreditCard,
    },
    {
      key: PaymentMethod.TRANSFER,
      label: 'Virement bancaire',
      icon: Banknote,
    },
    {
      key: PaymentMethod.CHECK,
      label: 'Chèque',
      icon: TicketCheck,
    },
  ]

  return (
    <Dialog>
      <DialogTrigger disabled={disabled} asChild>
        {!isMobile ? (
          <CustomButton
            label={label}
            className={cn(
              'ml-1 hidden h-fit rounded-[6px] px-7 py-3 text-white lg:flex',
              className
            )}
            disabled={disabled}
            IconLeft={IconLeft}
            IconRight={IconRight}
          />
        ) : (
          <CustomButton
            label={label}
            className={cn(
              'ml-1 flex w-full rounded-[18px] border-primary bg-primary px-7 py-3 text-white lg:hidden',
              className
            )}
            disabled={disabled}
            IconRight={CheckCheck}
          />
        )}
      </DialogTrigger>
      <DialogContent className='flex h-screen w-full max-w-full flex-col gap-[1.875rem] rounded-none p-0 lg:h-fit lg:max-h-[95vh] lg:min-h-fit lg:max-w-[42.5rem] lg:rounded-[14px] lg:p-4 [&>.Icon]:hidden'>
        <DialogTitle className='hidden text-[1.375rem] font-normal text-lynch-400 lg:flex'>
          {t('title')}
        </DialogTitle>
        <div className='w-full font-normal text-lynch-400 lg:hidden'>
          <MobileHeader
            title={t('title')}
            onClick={() => {}}
            buttonType='dialog'
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex w-full flex-1 flex-col justify-between gap-3 overflow-auto p-4'
          >
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-4 lg:flex-row'>
                <div className='w-full'>
                  <Select
                    label='Type'
                    value={paymentMethod}
                    onChange={(value) =>
                      handlePaymentChange(value as PaymentMethod)
                    }
                    options={options}
                  />
                </div>
              </div>
              <div className='flex flex-col gap-6'>
                {paymentMethod === PaymentMethod.CASH && (
                  <div className='flex flex-col items-center gap-4 lg:flex-row'>
                    <FormField
                      name={'amount' as any}
                      control={control}
                      render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-1'>
                          <Label label='Amount' />
                          <InputWithCurrancy
                            label={'Amount'}
                            name={'amount'}
                            placeholder='Enter amount'
                            disabled
                            value={field.value}
                            currancy={currencies}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={'date' as any}
                      render={({ field }) => (
                        <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                          <Label
                            label='Date de récupération'
                            className='text-sm font-semibold text-lynch-950'
                          />
                          <DatePicker
                            onChange={(value) => {
                              if (value) field.onChange(value.toISOString())
                            }}
                            value={field.value}
                          />
                          <FormMessage {...field} />
                        </div>
                      )}
                    />
                  </div>
                )}

                {paymentMethod === PaymentMethod.CARD_BANK && (
                  <div className='flex flex-col gap-4'>
                    <FormField
                      name={'amount' as any}
                      control={control}
                      render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-1'>
                          <Label label='Amount' />
                          <InputWithCurrancy
                            label={'Amount'}
                            name={'amount'}
                            placeholder='Enter amount'
                            disabled
                            value={field.value}
                            currancy={currencies}
                          />
                        </FormItem>
                      )}
                    />
                    <div className='flex flex-col gap-4 lg:flex-row'>
                      <InputFieldForm
                        label='Card Holder Name'
                        name='cardHolderName'
                        control={control}
                        placeholder='Enter card holder name'
                      />
                      <InputFieldForm
                        label='Last 4 Digits'
                        name='last4Digits'
                        control={control}
                        placeholder='Enter last 4 digits'
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === PaymentMethod.TRANSFER && (
                  <div className='flex flex-col gap-4'>
                    <FormField
                      name={'amount' as any}
                      control={control}
                      render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-1'>
                          <Label label='Amount' />
                          <InputWithCurrancy
                            label={'Amount'}
                            name={'amount'}
                            placeholder='Enter amount'
                            disabled
                            value={field.value}
                            currancy={currencies}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={'document' as any}
                      render={({ field }) => (
                        <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                          <Label
                            label='Document de virement'
                            className='text-sm font-semibold text-lynch-950'
                          />
                          <UploadFile
                            onChange={(value) => {
                              if (value) {
                                field.onChange(value[0].name)
                              }
                            }}
                            value={field.value}
                          />
                          <FormMessage {...field} />
                        </div>
                      )}
                    />
                  </div>
                )}

                {paymentMethod === PaymentMethod.CHECK && (
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-4 lg:flex-row'>
                      <FormField
                        name={'amount' as any}
                        control={control}
                        render={({ field }) => (
                          <FormItem className='flex w-full flex-col gap-1'>
                            <Label label='Montant a payer' />
                            <InputWithCurrancy
                              label={'Montant a payer'}
                              name={'amount'}
                              placeholder='Enter amount'
                              disabled
                              value={field.value}
                              currancy={currencies}
                            />
                          </FormItem>
                        )}
                      />
                      <InputFieldForm
                        label='Check Number'
                        name='checkNumber'
                        control={control}
                        placeholder='Enter check number'
                      />
                    </div>
                    <div className='flex flex-col gap-4 lg:flex-row'>
                      <FormField
                        control={control}
                        name={'dateOfWrite' as any}
                        render={({ field }) => (
                          <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                            <Label
                              label='Date échéance'
                              className='text-sm font-semibold text-lynch-950'
                            />
                            <DatePicker
                              onChange={(value) =>
                                value && field.onChange(value.toISOString())
                              }
                              value={field.value}
                            />
                            <FormMessage {...field} />
                          </div>
                        )}
                      />
                      <FormField
                        control={control}
                        name={'dateOfGet' as any}
                        render={({ field }) => (
                          <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                            <Label
                              label='Date de récupération'
                              className='text-sm font-semibold text-lynch-950'
                            />
                            <DatePicker
                              onChange={(value) =>
                                value && field.onChange(value.toISOString())
                              }
                              value={field.value}
                            />
                            <FormMessage {...field} />
                          </div>
                        )}
                      />
                    </div>
                    <div className='flex flex-col gap-4 lg:flex-row'>
                      <SelectField
                        options={optionsBank}
                        label='Bank'
                        name='bankCompany'
                        control={control}
                        placeholder='Enter bank company'
                      />
                      <InputFieldForm
                        label='Issuer Name'
                        name='issuerName'
                        control={control}
                        placeholder='Enter issuer name'
                      />
                    </div>
                    <FormField
                      control={control}
                      name={'document' as any}
                      render={({ field }) => (
                        <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                          <Label
                            label='Document de virement'
                            className='text-sm font-semibold text-lynch-950'
                          />
                          <UploadFile
                            onChange={(value) => {
                              if (value) {
                                field.onChange(value[0].name)
                              }
                            }}
                            value={field.value}
                          />
                          <FormMessage {...field} />
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className='mt-2 flex flex-row items-end gap-3 lg:justify-end'>
              <DialogClose asChild>
                <CustomButton
                  type='button'
                  label={t('cancel').toUpperCase()}
                  variant='outline'
                  className='order-3 h-full w-full min-w-32 rounded-[12px] px-5 py-3 text-lynch-400 lg:order-[0] lg:w-fit'
                  IconRight={X}
                />
              </DialogClose>
              <CustomButton
                label={t('confirm').toUpperCase()}
                type='submit'
                onClick={() => {}}
                className='h-full w-full min-w-32 rounded-[12px] px-5 py-3 lg:w-fit'
                IconRight={CheckCircle}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
