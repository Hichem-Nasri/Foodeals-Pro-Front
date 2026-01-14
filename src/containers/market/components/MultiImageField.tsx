import { AvatarProfile } from '@/components/tools/AvatarProfile'
import { AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form'
import { convertImage } from '@/utils/utils'
import { Box, ImagePlus, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Control } from 'react-hook-form'
import MultiImagesPlus from './MultiImagesPlus'

interface MultiImageFieldProps {
  control: Control<any>
  name: string
  withAdd?: boolean
}

const MultiImageField: React.FC<MultiImageFieldProps> = ({
  name,
  control,
  withAdd = true,
}) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const images = field.value.filter(
          (images: any) => convertImage(images).length > 0
        )
        return (
          <MultiImagesPlus
            images={images}
            onChange={(data) => {
              field.onChange(data)
            }}
            withAdd={withAdd}
          />
        )
      }}
    />
  )
}

export default MultiImageField
