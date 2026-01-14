// import { cancelOrder } from '@/actions/market'
import { CustomButton } from '@/components/custom/CustomButton'
import { InputFieldForm } from '@/components/custom/InputField'
import { Label } from '@/components/custom/Label'
import MobileHeader from '@/components/custom/MobileHeader'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { UploadFile } from '@/components/utils/UploadFile'
import AttachmenentDialog from '@/containers/support/newDemande/AttachmenentDialog'
import { useNotification } from '@/context/NotifContext'
import { DonateRoutes, MarketRoutes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import {
  cancelOrderSchema,
  defaultCancelOrder,
} from '@/schemas/pro-market/market-schema'
import { NotificationType } from '@/types/GlobalType'
import api from '@/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Send, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface DialogCancelOrder {
  id: string
  donateId: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  disabled?: boolean
  data: z.infer<typeof cancelOrderSchema>
}

const DialogCancelOrder: React.FC<DialogCancelOrder> = ({
  id,
  donateId,
  open,
  setOpen,
  disabled = false,
  data,
}) => {
  console.log('canceled: ', data)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-white px-0 py-0 lg:top-1/2 lg:h-auto lg:min-h-fit lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:px-4 lg:py-4'
        showContent={false}
      >
        <CancelOrder
          id={id}
          disabled={disabled}
          setOpen={setOpen}
          data={data}
          donateId={donateId}
        />
      </DialogContent>
    </Dialog>
  )
}

const CancelOrder: React.FC<Omit<DialogCancelOrder, 'open'>> = ({
  id,
  disabled,
  setOpen,
  donateId,
  data,
}) => {
  const { notify } = useNotification()
  const tDonate = useDonateTranslations()
  const { mutate, isPending } = useMutation({
    mutationKey: ['recovery'],
    mutationFn: async (data: z.infer<typeof cancelOrderSchema>) => {
      const formData = new FormData()
      formData.append(
        'file',
        cancelOrderSchema.parse(data).attachements as Blob
      )

      const res = await api.delete(
        `http://localhost:8080/v1/donates/delete/${donateId}/${id}?motif=${data.motif}&reason=${data.content}`,
        { data: formData }
      ) // TODO: Change this to the correct ID
      if ([200, 201, 204].includes(res.status)) {
        return res.status
      }
      throw new Error(tDonate('cancel.deleteError'))
      // return cancelOrder({ id, data })
    },
    onSuccess: () => {
      notify(
        NotificationType.SUCCESS,
        tDonate('cancel.success'),
        'dialog'
      )
      router.push(DonateRoutes.home)
    },
    onError: (error) => {
      console.log('error: ', error)
      notify(
        NotificationType.ERROR,
        tDonate('cancel.error')
      )
    },
  })
  const form = useForm<z.infer<typeof cancelOrderSchema>>({
    resolver: zodResolver(cancelOrderSchema),
    mode: 'onChange',
    defaultValues: { ...data },
  })
  const { handleSubmit } = form
  const onSubmit = (data: z.infer<typeof cancelOrderSchema>) => {
    mutate(data)
  }
  const router = useRouter()
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-3'
      >
        <DialogTitle className='hidden w-full items-center justify-between lg:flex'>
          <h1 className='text-xl text-lynch-500'>{tDonate('cancel.title')}</h1>
          <DialogClose className='p-2 text-lynch-400'>
            <X size={24} />
          </DialogClose>
        </DialogTitle>
        <MobileHeader
          title={tDonate('cancel.title')}
          buttonType='dialog'
          onClick={() => {}}
          color='blue'
        />
        <DialogDescription className='flex h-auto w-full flex-col gap-3 overflow-y-auto rounded-[18px] bg-white p-4'>
          <h1 className='my-3 hidden text-xl text-lynch-950 lg:inline-flex'>
            {tDonate('cancel.details')}
          </h1>
          <InputFieldForm
            control={form.control}
            name='motif'
            placeholder={tDonate('cancel.reasonPlaceholder')}
            className='h-14'
            label={tDonate('cancel.reason')}
            disabled={disabled}
          />
          <FormField
            render={({ field }) => {
              return (
                <FormItem className='flex w-full flex-col items-start'>
                  <Label label={tDonate('cancel.subject')} />
                  <Textarea
                    {...field}
                    className='h-48 text-base text-lynch-400 disabled:cursor-text'
                    placeholder={tDonate('cancel.subjectPlaceholder')}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={disabled}
                  />
                  <FormMessage {...field} />
                </FormItem>
              )
            }}
            name={'content'}
          />
          <FormField
            render={({ field }) => {
              return (
                <FormItem className='flex w-full flex-col items-start'>
                  <Label label={tDonate('cancel.attachment')} />
                  {disabled ? (
                    <AttachmenentDialog attachment={field.value} />
                  ) : (
                    <UploadFile
                      onChange={(e) => {
                        console.log('e: ', e)
                        if (e && e.length > 0) field.onChange(e[0])
                        else field.onChange(null)
                      }}
                      multiSelect={false}
                      disabled={disabled}
                    />
                  )}
                  <FormMessage {...field} />
                </FormItem>
              )
            }}
            name={'attachements'}
          />
        </DialogDescription>
        <div
          className={cn(
            'fixed bottom-0 left-0 flex w-full gap-2 rounded-t-[18px] bg-white p-3 lg:relative lg:justify-end lg:rounded-[18px] lg:shadow-none',
            `${disabled && 'hidden'}`
          )}
        >
          <DialogClose className='w-full lg:w-fit'>
            <CustomButton
              variant='outline'
              label={tDonate('cancel.cancel')}
              className='w-full lg:w-fit'
              IconRight={X}
              type='button'
              size={'sm'}
              disabled={disabled || isPending}
              title={tDonate('cancel.cancel')}
            />
          </DialogClose>
          <CustomButton
            size={'sm'}
            label={tDonate('cancel.confirm')}
            className='w-full bg-scooter-500 transition-colors hover:bg-scooter-100 hover:text-scooter-500 lg:w-fit'
            type='submit'
            title={tDonate('cancel.confirm')}
            IconRight={Send}
            disabled={disabled || isPending || !form.formState.isValid}
            onClick={() => {}}
          />
        </div>
      </form>
    </Form>
  )
}

type cancelOrder = {
  id: string
  data: z.infer<typeof cancelOrderSchema>
}

export const cancelOrder = async ({
  id,
  data,
}: cancelOrder): Promise<number> => {
  try {
    const { attachements, ...rest } = data
    const blob = new Blob(
      [
        JSON.stringify({
          reason: data.motif,
          subject: data.content,
        }),
      ],
      { type: 'application/json' }
    )
    const formData = new FormData()
    formData.append('attachment', attachements as Blob)
    formData.append('cancelRequest', blob)
    const response = await api.patch(`/orders/${id}/cancel`, formData)
    if (response.status !== 200) {
      throw new Error('Error: canceling order failed')
    }
    return response.status
  } catch (error) {
    throw new Error('Error: canceling order failed')
  }
}

export default DialogCancelOrder
