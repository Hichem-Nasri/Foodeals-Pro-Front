import MobileHeader from '@/components/custom/MobileHeader'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import React from 'react'
import { CustomButton } from '@/components/custom/CustomButton'
import ProductCardConfirm from '../gestions/Products/ProductCardConfirm';

interface ProductConfirmationProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    product: any
}

const ProductConfirmation: React.FC<ProductConfirmationProps> = ({
    open,
    setOpen,
    product,
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className='top-0 flex h-screen min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto bg-lynch-50 px-0 py-0 lg:top-1/2 lg:h-[500px] lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:px-4 lg:py-4'
                showContent={false}
            >
                <DialogTitle className='hidden items-center justify-between text-wrap text-base font-normal text-lynch-500 lg:flex'>
                    <span>
                        Importer par une image de produit avec Foodeals Lens
                    </span>
                    <button
                        type='button'
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        <X />
                    </button>
                </DialogTitle>
                <MobileHeader
                    title='Gestion des produits'
                    onClick={() => setOpen((prev) => !prev)}
                />
                <DialogDescription className='relative flex h-full w-full flex-col gap-6 overflow-auto bg-lynch-50 px-2 py-3'>
                    <div className='flex w-full items-center justify-between py-6 text-2xl text-lynch-950'>
                        Nos Produits
                    </div>
                    <div className='flex flex-col gap-6'>
                        {product &&
                            product.map((item: any) => (
                                <ProductCardConfirm product={item} />
                            ))}
                    </div>
                    <div className='sticky -bottom-4 w-full rounded-t-[24px] bg-white p-4'>
                        <CustomButton
                            label='Confirmer'
                            size='sm'
                            className='h-16 w-full rounded-[18px]'
                            onClick={() => setOpen(false)}
                        />
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default ProductConfirmation
