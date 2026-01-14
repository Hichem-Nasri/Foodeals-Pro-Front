'use client'
import { LoaderCircle, PictureInPicture, X } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { appApi } from '@/lib/routes'
import api from '@/utils/api'
import { useMutation } from '@tanstack/react-query'

export function ImageUpload({
  handleScanProduct,
}: {
  handleScanProduct: (data: any) => void
}) {
  const [image, setImage] = useState<File | null>(null)
  const [uploadedData, setUploadedData] = useState<any | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutate, isPending } = useMutation({
    mutationKey: ['product'],
    mutationFn: async (data: any) => {
      try {
        const formData = new FormData()
        formData.append('file', data)
        const response = await api
          .post(appApi.scanProduct, formData)
          .then((res) => res.data)
          .catch((error) => {
            throw new Error(error)
          })

        return response
      } catch (error) {
        throw new Error('Error uploading image')
      }
    },
    onSuccess: (data: any) => {
      handleScanProduct(data)
    },
    onError: () => {
      setErrorMessage('Failed to upload image')
    },
  })

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (image) return
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      setImage(files[0])
      mutate(files[0])
    }
  }

  const handleClick = () => {
    if (image) return
    if (inputRef.current) inputRef.current.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (image) return
    const files = e.target.files
    if (files && files.length > 0 && !isPending) {
      setImage(files[0])
      mutate(files[0])
    }
  }

  return (
    <>
      <div
        className='relative hidden h-full w-full cursor-pointer flex-col overflow-hidden rounded-md border-gray-300 bg-lynch-50 outline-dashed outline-2 outline-lynch-400 hover:border-gray-400 hover:outline focus:outline-none focus:ring-2 focus:ring-blue-500 lg:flex'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type='file'
          accept='image/*'
          ref={inputRef}
          hidden
          onChange={handleChange}
        />
        <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center'>
          {image ? (
            <div className='flex flex-col items-center'>
              <div className='relative flex aspect-square h-full w-full items-center justify-center'>
                <Image
                  src={URL.createObjectURL(image)}
                  alt='Uploaded Image'
                  className='aspect-auto h-auto w-full object-cover'
                  width={150}
                  height={150}
                />
                <div
                  className='absolute h-12 w-12 rounded rounded-tl-[17px] border-l-4 border-t-4 border-primary'
                  style={{ top: '0', left: '0' }}
                ></div>
                <div
                  className='absolute h-12 w-12 rounded rounded-tr-[17px] border-r-4 border-t-4 border-primary'
                  style={{ top: '0', right: '0' }}
                ></div>
                <div
                  className='absolute h-12 w-12 rounded rounded-bl-[17px] border-b-4 border-l-4 border-primary'
                  style={{ bottom: '0', left: '0' }}
                ></div>
                <div
                  className='absolute h-12 w-12 rounded rounded-br-[17px] border-b-4 border-r-4 border-primary'
                  style={{ bottom: '0', right: '0' }}
                ></div>
                <div className='to-bg-transparent absolute left-0 top-0 mx-auto flex h-full w-full animate-scan-up-down items-center justify-center bg-gradient-to-b from-transparent via-primary/80 px-2'>
                  <div className='absolute h-1 w-full rounded-full bg-primary/80' />
                </div>
              </div>
              {isPending && (
                <LoaderCircle className='animate-spin text-primary' size={30} />
              )}
              <h6 className='text-xs'>Récupération des données en cours...</h6>
            </div>
          ) : (
            <div className='flex items-center justify-center space-x-2 text-lynch-400'>
              <PictureInPicture size={48} />
              <div className='flex flex-col items-start text-xs font-light text-black'>
                <p>Faites glisser une image ici ou</p>
                <p className='text-sm text-mountain-400 underline underline-offset-1'>
                  importez une image
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {uploadedData && (
        <div className='mt-4'>
          <h2>Upload Result:</h2>
          <pre>{JSON.stringify(uploadedData, null, 2)}</pre>
        </div>
      )}
      {errorMessage && (
        <div className='mt-4 text-red-500'>
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  )
}
