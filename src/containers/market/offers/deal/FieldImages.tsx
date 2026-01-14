import { Label } from '@/components/custom/Label'
import { FormField, FormMessage } from '@/components/ui/form'
import React from 'react'
import { Control } from 'react-hook-form'
import MultiImageUpload from '../../components/MultiImageUpload'

interface FieldImagesProps {
  name: string
  label: string
  control: Control<any>
  disabled?: boolean
}

const FieldImages: React.FC<FieldImagesProps> = ({
  name,
  label,
  control,
  disabled = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='flex flex-col gap-3'>
          {label && <Label label={label} />}
          <MultiImageUpload
            images={field.value}
            setImages={field.onChange}
            disabled={disabled || field.disabled}
          />
          <FormMessage {...field} />
        </div>
      )}
    />
  )
}

export default FieldImages
