'use client'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ImagePlus } from 'lucide-react'
import Image from 'next/image'
import React, { forwardRef, useEffect, useState } from 'react'

interface ImageUploadAndPreviewProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  > {
  value: File[] | null
  onChange: (...event: any[]) => void
  defaultImage?: string | null
}

const ImageUploadAndPreview = forwardRef<
  HTMLInputElement,
  ImageUploadAndPreviewProps
>(({ value, onChange, defaultImage = null, ...props }, ref) => {
  const [previewImage, setPreviewImage] = useState<string | null>(defaultImage)

  useEffect(() => {
    const filelist = value
    if (filelist && filelist[0]) {
      const newUrl = URL.createObjectURL(filelist[0])
      setPreviewImage(newUrl)
    }
  }, [])

  console.log(props.disabled)
  return (
    <FormItem className='w-full'>
      <FormLabel
        className={cn(
          'relative mx-auto flex aspect-[4/3.2] max-h-[500px] cursor-pointer items-center justify-center overflow-hidden rounded-[16px] border-2 border-lynch-100 bg-white text-lynch-200',
          { 'cursor-default': props.disabled }
        )}
      >
        {!previewImage && <ImagePlus size={80} strokeWidth={1.2} />}
        {previewImage && (
          <Image
            src={previewImage}
            alt='Preview'
            className='object-cover'
            fill
          />
        )}
      </FormLabel>
      <FormControl>
        <Input
          className='hidden'
          type='file'
          accept='image/*'
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onChange(e.target.files)
              setPreviewImage(URL.createObjectURL(file))
            }
          }}
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
})

ImageUploadAndPreview.displayName = 'ImageUploadAndPreview'

export default ImageUploadAndPreview
