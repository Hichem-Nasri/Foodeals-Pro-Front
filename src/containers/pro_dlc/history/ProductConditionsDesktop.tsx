'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Form } from '@/components/ui/form'
import { InputFieldForm } from '@/components/custom/InputField'

interface WithdrawalConditionsProps {
  product: {
    dateEncoreFraiche: string
    dateFraiche: string
    dateAConsommerBientot: string
    prgEncoreFraiche: string
    prgFraiche: string
    prgAConsommerBientot: string
  }
}

const conditionStyles = {
  urgent: {
    className:
      'disabled:bg-[#FEF2F2] disabled:text-[#EF4444] disabled:placeholder-[#EF4444]',
  },
  required: {
    className:
      'disabled:bg-[#FEF9E8] disabled:text-[#EAB308] disabled:placeholder-[#EAB308]',
  },
  desirable: {
    className:
      'disabled:bg-[#ECFDF7] disabled:text-[#10B981] disabled:placeholder-[#10B981]',
  },
} as const

type ConditionStyleType = keyof typeof conditionStyles

interface ConditionFormProps {
  status: string
  days: string
  reduction: string
  styleType: ConditionStyleType
}

const ConditionForm = ({
  status,
  days,
  reduction,
  styleType,
}: ConditionFormProps) => {
  const formSchema = z.object({
    status: z.string(),
    days: z.string(),
    reduction: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status,
      days: `J-${days}`,
      reduction,
    },
  })

  return (
    <Form {...form}>
      <form className='flex w-full gap-4'>
        <div className='w-1/2'>
          <InputFieldForm
            control={form.control}
            name='status'
            label='Statut'
            disabled
            className={conditionStyles[styleType].className}
          />
        </div>
        <div className='w-1/4'>
          <InputFieldForm
            control={form.control}
            name='days'
            label='Nombre de jour'
            disabled
            placeholder='Nombre de jour'
          />
        </div>
        <div className='w-1/4'>
          <InputFieldForm
            control={form.control}
            name='reduction'
            label='Reduction'
            disabled
            placeholder='Réduction'
          />
        </div>
      </form>
    </Form>
  )
}

export const WithdrawalConditions: React.FC<WithdrawalConditionsProps> = ({
  product,
}) => {
  const calculateRemainingDays = (date: string) => {
    const diff = new Date(date).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <Accordion
      type='single'
      collapsible
      className='w-full rounded-[14px] bg-white px-4 py-6 lg:p-5'
      defaultValue='conditions'
    >
      <AccordionItem
        value='conditions'
        className='text-[1.375rem] font-normal text-lynch-400'
      >
        <AccordionTrigger className='py-0 text-[1.375rem] font-normal'>
          Condition de retrait
        </AccordionTrigger>
        <AccordionContent className='space-y-6 pt-7'>
          <ConditionForm
            status='Valorisation urgente'
            days={calculateRemainingDays(
              product?.dateAConsommerBientot
            ).toString()}
            reduction={`${product?.prgAConsommerBientot}%`}
            styleType='urgent'
          />
          <ConditionForm
            status='Valorisation exigée'
            days={calculateRemainingDays(product?.dateEncoreFraiche).toString()}
            reduction={`${product?.prgEncoreFraiche}%`}
            styleType='required'
          />
          <ConditionForm
            status='Valorisation souhaitable'
            days={calculateRemainingDays(product?.dateFraiche).toString()}
            reduction={`${product?.prgFraiche}%`}
            styleType='desirable'
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default WithdrawalConditions
