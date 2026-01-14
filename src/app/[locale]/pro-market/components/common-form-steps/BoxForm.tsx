'use client'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { useState } from 'react'
import {
  useDeleteBox,
  usePostUpdateBox,
  useRelaunchBox,
} from '@/hooks/pro-market/queries/offrers-queries'
import { BoxNormalFormSchema, BoxNormalFormType } from './CommonFormSchema'
import { boxDataToFormData } from '../../offres/_utils/BoxDataToFormData'
import { StepOne } from './StepOne'
import { StepTwo } from './StepTwo'
import { StepThree } from './StepThree'
import RelaunchButtonWithDialog from '../../offres/components/RelaunchButtonWithDialog'
import UpdateDeleteArchiveButtons from '../../offres/components/UpdateDeleteArchiveButtons'
import PrevNextSubmitButtonsBoxForm from '../../offres/components/PrevNextSubmitButtonsBoxForm'
import { BagSuccessDialog } from '../BagSuccessDialog'
import EditHistory from './EditHistory'
import { useOffersTranslations } from '@/hooks/useTranslations'

export default function BoxForm({
  defaultValues,
  disabled = false,
  image,
  edit = false,
  id = '',
  type = 'normal',
  isHistory = false,
}: {
  defaultValues: BoxNormalFormType
  disabled?: boolean
  image?: string
  edit?: boolean
  id?: string
  type?: 'normal' | 'surprise'
  isHistory?: boolean
}) {
  const t = useOffersTranslations()
  const [model, setModel] = useState({
    isOpen: false,
    content: '',
  })
  const [step, setStep] = useState(0)
  const postUpdateBox = usePostUpdateBox(type)
  const deleteBox = useDeleteBox(type)
  const relaunchBox = useRelaunchBox(type)

  const form = useForm<BoxNormalFormType>({
    resolver: zodResolver(BoxNormalFormSchema),
    defaultValues,
    disabled,
    mode: 'onBlur',
    shouldFocusError: true,
  })

  const isLoading = postUpdateBox.isPending || postUpdateBox.isSuccess
  const onSubmit = (data: BoxNormalFormType) => {
    postUpdateBox.mutate(
      {
        method: edit ? 'PUT' : 'POST',
        type,
        formData: boxDataToFormData({ data, type }),
        id,
      } as any,
      {
        onSuccess: () => {
          const boxType = type === 'normal' ? t('tabs.deals') : t('tabs.surpriseBoxes')
          const action = edit ? t('actions.update') : t('actions.publish')
          setModel({
            isOpen: true,
            content: `${boxType} ${action} ${t('messages.successSuffix')}`,
          })
          setTimeout(() => {
            setModel((prev) => ({ ...prev, isOpen: false }))
          }, 1000)
        },
      }
    )
  }

  const relaunchHandler = () => {
    relaunchBox.mutate(id, {
      onSuccess() {
        setModel({
          isOpen: true,
          content: t('messages.relaunchSuccess'),
        })
        setTimeout(() => {
          setModel((prev) => ({ ...prev, isOpen: false }))
        }, 1000)
      },
    })
  }

  const nextStepsHandler = async () => {
    let goNext = false
    if (step === 0) {
      goNext = await form.trigger(
        type === 'normal'
          ? [
              'image',
              'title',
              'publishAs',
              'categorie',
              'description',
              'unitType',
              'quantity',
            ]
          : ['title', 'publishAs', 'description', 'unitType', 'quantity'],
        { shouldFocus: true }
      )
    } else if (step === 1) {
      goNext = await form.trigger(
        [
          'consumptionMethods',
          'deliveryCost',
          'initialPrice',
          'reductionPercentage',
        ],
        { shouldFocus: true }
      )
    } else if (step === 2) {
      goNext = await form.trigger(
        [
          'startDate',
          'endDate',
          'startTime',
          'endTime',
          'expirationDate',
          'paymentMethod',
        ],
        { shouldFocus: true }
      )
    }
    if (goNext) {
      setStep((prev) => prev + 1)
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          className='flex h-full flex-col gap-6'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='flex flex-col gap-6'>
            {!disabled ? (
              <>
                {step === 0 && <StepOne offerImage={image} type={type} />}
                {step === 1 && <StepTwo />}
                {step === 2 && <StepThree />}
              </>
            ) : (
              <>
                <StepOne offerImage={image} type={type}>
                  {isHistory && !edit && (
                    <RelaunchButtonWithDialog actionFn={relaunchHandler} />
                  )}
                </StepOne>
                <StepTwo />
                <StepThree />
              </>
            )}
            {isHistory && <EditHistory boxId={id} />}
          </div>

          {disabled ? (
            <UpdateDeleteArchiveButtons
              deleteActionFn={() => {
                deleteBox.mutate(id)
              }}
              isLoading={deleteBox.isPaused || deleteBox.isSuccess}
              boxId={id}
              type={type}
              isHistory={isHistory}
            />
          ) : (
            <PrevNextSubmitButtonsBoxForm
              step={step}
              prevStepHandler={() => setStep((prev) => prev - 1)}
              nextStepHandler={nextStepsHandler}
              isLoading={isLoading}
            />
          )}
        </form>
      </Form>
      <BagSuccessDialog isOpen={model.isOpen} content={model.content} />
      <DevTool control={form.control} placement='top-left' />
    </>
  )
}
