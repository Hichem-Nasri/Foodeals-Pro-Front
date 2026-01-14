// src/containers/pro_dlc/history/UpdateDlcForm.tsx
import { Calendar, CheckCheck, X } from 'lucide-react'
import React, { FC } from 'react'
import { InputFieldForm } from '@/components/custom/InputField'
import { DatePicker } from '@/components/ui/DatePicker'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import {
  UpdateDlcFormSchema,
  DefaultUpdateDlcForm,
  UpdateDlcFormType,
} from '@/schemas/update-dlc-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CustomButton } from '@/components/custom/CustomButton'
import { useRouter } from 'next/navigation'
import { DlcRoutes } from '@/lib/routes'

const UpdateDlcForm: FC = () => {
  const router = useRouter()
  const form = useForm<UpdateDlcFormType>({
    resolver: zodResolver(UpdateDlcFormSchema),
    defaultValues: DefaultUpdateDlcForm,
    mode: 'onSubmit',
  })

  const { control, handleSubmit, reset } = form

  const handleCancel = () => {
    router.push(DlcRoutes.dlc)
  }

  return (
    <Form {...form}>
      <form
        id='updateDlcForm' // Add form ID here
        onSubmit={handleSubmit((data) => {
          // todo : add post request to the backend
          reset(DefaultUpdateDlcForm)
          router.push(DlcRoutes.dlc)
        })}
        className='flex w-full flex-col'
      >
        <div className='bg-[#F6F7F9]'>
          <div className='mx-auto w-full space-y-4 rounded-[24px] bg-white p-[25px_16px_16px_16px]'>
            <DatePicker
              control={control}
              name='expiryDate'
              label='Date de péremption'
              icon={Calendar}
            />
            <InputFieldForm
              control={control}
              name='quantity'
              label='Qté'
              placeholder='x20'
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default UpdateDlcForm
