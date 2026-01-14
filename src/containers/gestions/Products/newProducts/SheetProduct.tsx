import { CustomButton } from '@/components/custom/CustomButton'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { FileDown, Upload, X } from 'lucide-react'
import React, { FC, useState } from 'react'
import ProgressCircle from './ProgressCircle'
import { UploadFile } from '@/components/utils/UploadFile'
import MobileHeader from '@/components/custom/MobileHeader'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { appApi } from '@/lib/routes'
import { ProductsType } from '@/types/product-type'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface SheetProductProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    props: {
        setProducts: React.Dispatch<React.SetStateAction<ProductsType[]>>
        setProductConf: React.Dispatch<React.SetStateAction<boolean>>
    }
}
export const SheetProduct: FC<SheetProductProps> = ({
    open,
    setOpen,
    props,
}) => {
    const [file, setFile] = useState<File[] | null>(null)
    const [completedFiles, setCompletedFiles] = useState(0)
    const [products, setProducts] = useState<ProductsType[]>([])
    const [process, setProcess] = useState(false)

    const notif = useNotification()

    const { mutate, isPending } = useMutation({
        mutationKey: ['product'],
        mutationFn: async (data: File) => {
            try {
                const formData = new FormData()
                formData.append('file', data)
                const response = await api
                    .post(appApi.uploadProduct, formData)
                    .catch((error) => {
                        throw new Error(error)
                    })

                return response
            } catch (error) {
                setProcess(false)
                throw new Error("Une erreur s'est produite")
            }
        },
        onSuccess: (data: any) => {
            setProducts((prev) => [...prev, data])
            if (completedFiles === file?.length! - 1) {
                notif.notify(
                    NotificationType.SUCCESS,
                    'Produit importé avec succès'
                )
                props.setProducts(products)
                props.setProductConf(true)
                setOpen((prev) => !prev)
                setProcess(false)
                setCompletedFiles(0)
                setFile(null)
            }
            setCompletedFiles((prev) => prev + 1)
        },
        onError: (error) => {},
    })
    const Reset = () => {
        setCompletedFiles(0)
        setProcess(false)
        setFile(null)
        setOpen((prev) => !prev)
    }

    const handleConfirm = () => {
        setOpen((prev) => !prev)
    }

    const handleFileChange = async () => {
        if (!file || isPending) return
        setProcess(true)
        file?.forEach((file) => {
            mutate(file)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className='top-0 flex h-screen min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-lynch-50 px-0 py-0 lg:top-1/2 lg:h-auto lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:bg-white lg:px-4 lg:py-4'
                showContent={false}
            >
                <DialogTitle className='hidden items-center justify-between text-wrap text-lg font-light text-lynch-500 lg:flex'>
                    <span>
                        Chargez un fichier Excel et visualisez un récapitulatif
                        des produits avant validation.
                    </span>
                    <button type='button' onClick={Reset}>
                        <X />
                    </button>
                </DialogTitle>
                <MobileHeader
                    title='Importer des DLC'
                    onClick={Reset}
                    buttonType='dialog'
                />
                <DialogDescription className='relative flex h-full flex-col items-center justify-start space-y-2 px-3 py-5 pt-10 lg:bg-white'>
                    <div className='flex h-fit w-full flex-1 flex-col items-center justify-between rounded-t-[18px] bg-white p-4'>
                        <div className='flex w-full flex-col items-center justify-start'>
                            <h6 className='flex self-start text-pretty text-2xl font-normal text-lynch-950 lg:hidden'>
                                Chargez un fichier Excel et visualisez un
                                récapitulatif des produits avant validation.
                            </h6>
                            <Lottie
                                style={{
                                    width: '300px',
                                    height: '300px',
                                }}
                                animationData={require('@/lotties/uploadAnimation.json')}
                                loop
                                autoplay
                            />
                            {process ? (
                                <ProgressCircle
                                    totalFiles={file?.length!}
                                    completedFiles={completedFiles}
                                />
                            ) : (
                                <UploadFile
                                    placeholder='Charger le fichier'
                                    onChange={(file) => setFile(file)}
                                    Icon={FileDown}
                                    multiSelect
                                    extensions='.xlsx, .xls'
                                />
                            )}
                        </div>
                    </div>
                    <div className='fixed bottom-0 left-0 flex w-full justify-end gap-2 rounded-t-[24px] bg-white p-4 lg:relative lg:rounded-none'>
                        <CustomButton
                            label='ANNULER'
                            size={'sm'}
                            onClick={Reset}
                            variant='outline'
                            className='hidden min-w-32 lg:flex'
                            IconRight={X}
                        />
                        <CustomButton
                            label='Importer'
                            size={'sm'}
                            onClick={handleFileChange}
                            className='w-full min-w-32 bg-primary text-white lg:w-fit'
                            IconRight={Upload}
                            disabled={!file || isPending}
                        />
                    </div>
                </DialogDescription>
                {/* <ProgressCircle totalFiles={file?.length!} completedFiles={0} /> */}
            </DialogContent>
        </Dialog>
    )
}
