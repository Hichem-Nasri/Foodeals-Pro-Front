import React, { FC } from 'react'
import { Control } from 'react-hook-form'
import { InputFieldForm } from '../custom/InputField'
import { Mail, PhoneCall } from 'lucide-react'
import { AvatarAndName } from '../tools/AvatarAndName'
import { FormField } from '../ui/form'
import { capitalize } from '@/utils/utils'

interface ParnterProfileProps {
  email?: boolean
  phone?: boolean
  name: string
  control: Control<any>
  disabled?: boolean
  label?: string
}

const ParnterProfile: FC<ParnterProfileProps> = ({
  email,
  phone,
  name,
  control,
  disabled,
  label,
}) => {
  return (
    <div className='flex w-full items-center justify-between'>
      <h4 className='text-base font-semibold text-lynch-950'>{label}</h4>
      <FormField
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <AvatarAndName
              name={capitalize(field.value?.name)}
              avatar={field.value?.avatarPath || ''}
            />
          )
        }}
      />
    </div>
  )
}

export default ParnterProfile
