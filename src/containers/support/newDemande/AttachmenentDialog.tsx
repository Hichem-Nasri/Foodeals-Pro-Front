'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import {
  DialogTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { fileTypeMapping } from '@/components/utils/DialogImage'
import { mimeTypes } from '@/utils/utils'
import { Download, X } from 'lucide-react'
import React from 'react'

interface AttachmenentDialogProps {
  attachment: string
}

const AttachmenentDialog: React.FC<AttachmenentDialogProps> = ({
  attachment,
}) => {
  const file = attachment.split('/').pop() || ''
  const fileExtension = attachment.split('.').pop()?.toLowerCase() || ''
  console.log('file: ', file)
  const [open, setOpen] = React.useState(false)
  const renderContent = (file: string) => {
    // if (!file) return null

    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')
    return (
      <div className='flex flex-col items-center'>
        <DialogTitle className='my-4 flex flex-col items-center'>
          {isImage ? (
            <img
              src={attachment} // Use createObjectURL to display the image
              alt={`Uploaded ${file.slice(file.indexOf('/') + 1)}`}
              className='aspect-square size-64 cursor-pointer rounded-full border-2 border-lynch-50 object-cover'
              //   onClick={() => handleFileClick(URL.createObjectURL(blob))}
            />
          ) : (
            <div className='flex flex-col items-center'>
              <img
                src={`/icons/${fileTypeMapping[fileExtension as string]}.png`} // Replace with your file type icons
                alt={`${fileExtension} Document`}
                className='h-20 w-20 cursor-pointer'
                // onClick={() => handleFileClick(URL.createObjectURL(blob))}
              />
              <span className='mt-2 text-center'>{file}</span>
            </div>
          )}
          <CustomButton
            label=''
            type='button'
            size={'sm'}
            variant='outline'
            // onClick={() => handleDownload(URL.createObjectURL(blob))}
            className={`rounded-full [&>.icon]:m-0 ${
              isImage && 'absolute bottom-4 right-4 bg-white'
            }`}
            IconLeft={Download}
          />
        </DialogTitle>
        <DialogClose className='absolute -top-12 right-2 font-bold text-white transition-all hover:scale-95'>
          <X size={32} />
        </DialogClose>
      </div>
    )
  }
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='w-full'>
        <div className='relative flex min-h-fit justify-center rounded-[14px] bg-lynch-50 p-4'>
          <div className='flex h-1/2 flex-col items-center justify-between gap-2'>
            <div className='relative flex h-36 w-36 items-center justify-center'>
              {isImage ? (
                <button
                  className='m-auto flex h-36 w-36 items-center justify-center'
                  type='button'
                  title='Open Image'
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  <img
                    src={attachment}
                    alt={`Uploaded ${file}`}
                    className='aspect-square w-full rounded-full object-cover'
                  />
                </button>
              ) : (
                <button
                  className='m-auto flex h-36 w-36 items-center justify-center'
                  type='button'
                  title='Open File'
                >
                  <img
                    src={`/icons/${
                      fileTypeMapping[fileExtension as string]
                    }.png`}
                    alt={`${fileExtension} Document`}
                    className='size-20 cursor-pointer'
                    width={64}
                  />
                </button>
              )}
            </div>
            <span className='text-sm text-lynch-400'>
              {file.length > 10 ? file.slice(0, 10) + '...' : file}
            </span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className='rounded-[18px]' showContent={false}>
        {renderContent(file)}
      </DialogContent>
    </Dialog>
  )
}

export default AttachmenentDialog
