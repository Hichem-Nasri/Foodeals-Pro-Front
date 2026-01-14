'use client'
import React, { FC, useEffect } from 'react'
import { CloudUpload, Download, X } from 'lucide-react'
import { Button } from 'react-day-picker'
import { set } from 'date-fns'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'
import { CustomButton } from '../custom/CustomButton'
import { UploadFile } from './UploadFile'

interface DialogImageProps {
  file: File
  onChange: (files: File) => void
}

export const fileTypeMapping: { [key: string]: string } = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  pdf: 'pdf',
  xls: 'excel',
  xlsx: 'excel',
  doc: 'word',
  docx: 'word',
  ppt: 'powerpoint',
  pptx: 'powerpoint',
  txt: 'Text',
  // Add more mappings as needed
}

const DialogImage: FC<DialogImageProps> = ({ file, onChange }) => {
  const [open, setOpen] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File | null>(file)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const handleFileClick = (file: string) => {
    // Logic to open the file in a new tab
    window.open(file, '_blank')
  }

  const handleDownload = (file: string) => {
    // Logic to download the file
    const link = document.createElement('a')
    link.href = file
    link.download = file.split('/').pop() || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      setSelectedFiles(selectedFiles[0])
      onChange(selectedFiles[0])
    }
  }

  useEffect(() => {}, [selectedFiles])

  const renderContent = (file: File) => {
    if (!file) return null

    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')

    return (
      <div className='flex flex-col items-center'>
        <div className='my-4 flex flex-col items-center'>
          {isImage ? (
            <img
              src={URL.createObjectURL(file)} // Use createObjectURL to display the image
              alt={`Uploaded ${file.name}`}
              className='aspect-square size-64 cursor-pointer rounded-full border-2 border-lynch-50 object-cover'
              onClick={() => handleFileClick(URL.createObjectURL(file))}
            />
          ) : (
            <div className='flex flex-col items-center'>
              <img
                src={`/icons/${fileTypeMapping[fileExtension as string]}.png`} // Replace with your file type icons
                alt={`${fileExtension} Document`}
                className='h-20 w-20 cursor-pointer'
                onClick={() => handleFileClick(URL.createObjectURL(file))}
              />
              <span className='mt-2 text-center'>{file.name}</span>
            </div>
          )}
          <CustomButton
            label=''
            type='button'
            size={'sm'}
            variant='outline'
            onClick={() => handleDownload(URL.createObjectURL(file))}
            className={`rounded-full [&>.icon]:m-0 ${
              isImage && 'absolute bottom-4 right-4 bg-white'
            }`}
            IconLeft={Download}
          />
        </div>
        <DialogClose className='absolute -top-12 right-2 font-bold text-white transition-all hover:scale-95'>
          <X size={32} />
        </DialogClose>
      </div>
    )
  }

  const handleFileSelection = (files: File[]) => {
    setSelectedFiles(files[0])
    if (files.length > 0) {
      setSelectedFile(files[0]) // Set the first selected file to display
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && setOpen(false)}>
      <DialogTrigger className='w-full'>
        <div className='hidden lg:flex'>
          <UploadFile
            value={selectedFiles ? [selectedFiles] : []}
            onChange={handleFileSelection} // Update to handle file selection
            setOpen={setOpen}
            setSelectedFile={setSelectedFile}
          />
        </div>
        <div className='relative flex min-h-fit justify-center rounded-[14px] bg-lynch-50 p-4 lg:hidden'>
          <input
            type='file'
            className='absolute left-0 top-0 h-full w-full cursor-pointer text-opacity-0 opacity-0 disabled:cursor-not-allowed'
            onChange={handleFileChange}
            disabled={false}
            multiple={true} // Enable multi-select
          />
          {selectedFiles ? (
            <div className='flex h-full flex-wrap items-center justify-center gap-2'>
              {(() => {
                if (!selectedFiles) return null
                const fileExtension = file?.name?.split('.').pop()
                const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(
                  fileExtension?.toLowerCase() || ''
                )

                return (
                  <div className='flex h-1/2 flex-col items-center justify-between gap-2'>
                    <div className='relative flex h-36 w-36 items-center justify-center'>
                      {isImage ? (
                        <button
                          className='m-auto flex h-36 w-36 items-center justify-center'
                          type='button'
                          title='Open Image'
                          onClick={() => {
                            setSelectedFile(file)
                            setOpen(true)
                          }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Uploaded ${file.name}`}
                            className='aspect-square w-full rounded-full object-cover'
                          />
                        </button>
                      ) : (
                        <button
                          className='m-auto flex h-36 w-36 items-center justify-center'
                          type='button'
                          title='Open File'
                          onClick={() =>
                            handleFileClick(URL.createObjectURL(file))
                          }
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
                      <button
                        className='absolute right-1 top-1 z-40 rounded-full bg-white text-lynch-400'
                        type='button'
                        title='remove Image'
                        onClick={() => {
                          setSelectedFiles(null)
                          setSelectedFile(null)
                        }}
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <span className='text-sm text-lynch-400'>
                      {file && file?.name?.length > 10
                        ? file.name.slice(0, 10) + '...'
                        : file.name}
                    </span>
                  </div>
                )
              })()}
            </div>
          ) : (
            <div className='flex w-full items-center justify-between text-lynch-300'>
              <h4>Selectionner les pieces</h4>
              <CloudUpload size={24} />
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className='rounded-[18px]' showContent={false}>
        {renderContent(selectedFile!)}
      </DialogContent>
    </Dialog>
  )
}

export default DialogImage
