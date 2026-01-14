'use client'
import { LoaderCircle, PictureInPicture, X } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { appApi } from '@/lib/routes'
import api from '@/utils/api'
import { useMutation } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import {
    ColorsT,
    getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'

export function ImageUpload({
    handleScanProduct,
    color = 'green',
}: {
    handleScanProduct: (data: any) => void
    color?: ColorsT
}) {
    const [image, setImage] = useState<File | null>(null)
    const [uploadedData, setUploadedData] = useState<any | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const { notify } = useNotification()
    const { mutate, isPending } = useMutation({
        mutationKey: ['product'],
        mutationFn: async (data: any) => {
            try {
                console.log('data image: ', data)
                const formData = new FormData()
                formData.append('file', data)
                const response = await api
                    .post('/dlcs/scan', formData)
                    .then((res) => res.data)
                    .catch((error) => {
                        console.log('error', error)
                        throw new Error(error)
                    })
                console.log('response', response)
                return response
            } catch (error) {
                throw new Error('Error uploading image')
            }
        },
        onSuccess: (data: any) => {
            handleScanProduct(data)
            notify(NotificationType.SUCCESS, 'DLC ajouté avec succès !')
            console.log('data', data)
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
            console.log('files:', files)
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
                            <div className='relative flex aspect-square w-full items-center justify-center'>
                                <Image
                                    src={URL.createObjectURL(image)}
                                    alt='Uploaded Image'
                                    className='aspect-auto h-auto w-full object-cover'
                                    width={150}
                                    height={150}
                                />
                                <div
                                    className={cn(
                                        'absolute h-12 w-12 rounded rounded-tl-[17px] border-l-4 border-t-4 border-tulip-500',
                                        getActiveColorClassName(color)
                                    )}
                                    style={{ top: '0', left: '0' }}
                                ></div>
                                <div
                                    className={`} absolute h-12 w-12 rounded rounded-tr-[17px] border-r-4 border-t-4 border-tulip-500`}
                                    style={{ top: '0', right: '0' }}
                                ></div>
                                <div
                                    className={`} absolute h-12 w-12 rounded rounded-bl-[17px] border-b-4 border-l-4 border-tulip-500`}
                                    style={{ bottom: '0', left: '0' }}
                                ></div>
                                <div
                                    className={`} absolute h-12 w-12 rounded rounded-br-[17px] border-b-4 border-r-4 border-tulip-500`}
                                    style={{ bottom: '0', right: '0' }}
                                ></div>
                                <div
                                    className={cn(
                                        'to-bg-transparent absolute left-0 right-0 top-0 mx-auto flex h-full w-full items-center justify-center bg-gradient-to-b from-transparent px-2'
                                    )}
                                >
                                    <div
                                        className={`h-1 w-full animate-scan-up-down rounded-full bg-tulip-400`}
                                    ></div>
                                </div>
                            </div>
                            {isPending && (
                                <LoaderCircle
                                    className={`animate-spin text-tulip-400`}
                                    size={30}
                                />
                            )}
                            <h6 className='text-xs'>
                                Récupération des données en cours...
                            </h6>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center space-x-2 text-lynch-400'>
                            <PictureInPicture size={48} />
                            <div className='flex flex-col items-start text-xs font-light text-black'>
                                <p>Faites glisser une image ici ou</p>
                                <p
                                    className={`text-sm text-tulip-400 underline underline-offset-1`}
                                >
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
