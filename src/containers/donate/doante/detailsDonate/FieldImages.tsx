import { Label } from '@/components/custom/Label'
import { FormField, FormMessage } from '@/components/ui/form'
import MultiImageUpload from '@/containers/market/components/MultiImageUpload'
import React from 'react'
import { Control } from 'react-hook-form'

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
