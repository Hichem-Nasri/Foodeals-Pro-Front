import { AvatarProfile } from '@/components/tools/AvatarProfile'
import { convertImage } from '@/utils/utils'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog'
import { Box, X, ImagePlus } from 'lucide-react'
import React from 'react'

interface MultiImagesPlusProps {
  images: any
  onChange: (data: any) => void
  withAdd: boolean
  disabled?: boolean
}

const MultiImagesPlus: React.FC<MultiImagesPlusProps> = ({
  images,
  onChange,
  withAdd,
  disabled,
}) => {
  return (
    <div className='grid grid-cols-3 gap-2'>
      {images && images.length > 0 && (
        <>
          {images.slice(0, 5).map((image: any, index: number) => (
            <div key={index} className='relative h-fit w-full'>
              <AvatarProfile
                onChange={(file) => {
                  const newImages = images.map((img: any, i: number) =>
                    i === index ? file : img
                  )
                  onChange(newImages)
                }}
                className='h-36 w-full rounded-[12px] bg-white lg:bg-lynch-50'
                disabled={disabled}
                iUrl={convertImage(image)}
              />
            </div>
          ))}
          {images.length > 5 && (
            <Dialog>
              <DialogTrigger className='boorder-lynch-300 h-36 w-full gap-3 rounded-[18px] border-2 bg-lynch-50 text-primary flex-col-center'>
                <Box size={28} />
                <p>Voir Plus</p>
              </DialogTrigger>
              <DialogContent
                className='h-fit w-full max-w-[90%]'
                showContent={false}
              >
                <DialogTitle className='text-lynch-500 flex-center-between'>
                  <p>Ajouter des images</p>
                  <DialogClose className=''>
                    <X size={24} />
                  </DialogClose>
                </DialogTitle>
                <DialogDescription className='flex h-full max-h-min w-fit flex-wrap items-center justify-center gap-3 overflow-y-auto'>
                  {images &&
                    images.map((image: any, index: number) => (
                      <div
                        key={index}
                        className='relative h-fit w-fit basis-[30%]'
                      >
                        <AvatarProfile
                          onChange={(file) => {
                            const newImages = images.map(
                              (img: any, i: number) =>
                                i === index ? file : img
                            )
                            onChange(newImages)
                          }}
                          Icon={<ImagePlus size={56} />}
                          className='h-36 w-full rounded-[12px] bg-white lg:bg-lynch-50'
                          disabled={disabled}
                          iUrl={convertImage(image)}
                        />
                      </div>
                    ))}
                  <div className='relative h-fit w-fit basis-[30%]'>
                    <AvatarProfile
                      onChange={(file) => {
                        onChange([...images, file])
                      }}
                      Icon={<ImagePlus size={56} />}
                      className='h-36 w-full rounded-[12px] bg-white lg:bg-lynch-50'
                      disabled={disabled}
                      iUrl={''}
                      useEmpty
                    />
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
      {(!images || (images && images.length < 5)) && withAdd && (
        <AvatarProfile
          onChange={(file) => {
            onChange([...images, file])
          }}
          Icon={<ImagePlus size={56} />}
          className='h-36 w-full rounded-[12px] bg-white lg:bg-lynch-50'
          disabled={disabled}
          iUrl={''}
          useEmpty
        />
      )}
    </div>
  )
}

export default MultiImagesPlus
