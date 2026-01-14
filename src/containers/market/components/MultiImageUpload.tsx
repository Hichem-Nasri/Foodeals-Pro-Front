import { AvatarProfile } from '@/components/tools/AvatarProfile'
import { convertImage } from '@/utils/utils'
import { ImagePlus } from 'lucide-react'
import React, { useEffect } from 'react'
import { useOffersTranslations } from '@/hooks/useTranslations'

interface MultiImageUploadProps {
  images: (string | File)[] | string[]
  setImages: React.Dispatch<React.SetStateAction<(string | File)[] | string[]>>
  disabled?: boolean
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  images,
  setImages,
  disabled = false,
}) => {
  const tOffers = useOffersTranslations()
  const [elements, setElements] = React.useState<(string | File)[]>(
    Array(4)
      .fill('')
      .map((_, index) =>
        convertImage(images.length > index ? images[index] : '')
      )
  )

  const handleElement = (index: number, file: File) => {
    setElements((prev) => {
      const newElements = Array.from(prev)
      newElements[index] = file
      return newElements
    })
  }
  useEffect(() => {
    setImages(elements)
  }, [elements])
  return (
    <div className='flex w-full flex-col items-center justify-center gap-3 rounded-[30px] bg-transparent p-0 lg:items-start lg:justify-start lg:bg-white lg:p-4'>
      <h1 className='hidden text-base font-medium text-lynch-950 lg:flex'>
        {tOffers('form.addImages')}
      </h1>
      <AvatarProfile
        iUrl={convertImage(images[0])}
        onChange={(file) => {
          if (file) {
            handleElement(0, file)
          }
        }}
        disabled={disabled}
        className='min-h-64 w-full rounded-[14px] bg-white lg:bg-lynch-50'
        Icon={<ImagePlus size={80} />}
      />
      <div className='flex w-full gap-3'>
        <AvatarProfile
          iUrl={convertImage(images[1])}
          onChange={(file) => {
            if (file) {
              handleElement(1, file)
            }
          }}
          disabled={disabled}
          Icon={<ImagePlus size={36} />}
          textEmpty={tOffers('form.addImageText')}
          className='min-h-32 w-full rounded-[14px] bg-white lg:bg-lynch-50'
        />
        <AvatarProfile
          iUrl={convertImage(images[2])}
          onChange={(file) => {
            if (file) {
              handleElement(2, file)
            }
          }}
          disabled={disabled}
          Icon={<ImagePlus size={36} />}
          textEmpty={tOffers('form.addImageText')}
          className='min-h-32 w-full rounded-[14px] bg-white lg:bg-lynch-50'
        />
        <AvatarProfile
          iUrl={convertImage(images[3])}
          onChange={(file) => {
            if (file) {
              handleElement(3, file)
            }
          }}
          disabled={disabled}
          Icon={<ImagePlus size={36} />}
          textEmpty={tOffers('form.addImageText')}
          className='min-h-32 w-full rounded-[14px] bg-white lg:bg-lynch-50'
        />
      </div>
    </div>
  )
}

export default MultiImageUpload
