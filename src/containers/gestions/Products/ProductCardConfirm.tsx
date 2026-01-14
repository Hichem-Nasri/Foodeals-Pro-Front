import React, { FC } from 'react'
import { Calendar, CalendarClock, Eye, PencilLine } from 'lucide-react'
import { AppRoutes } from '@/lib/routes'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProductsType } from '@/types/product-type'

interface ProductCardConfirmProps {
    product: ProductsType
}

const ProductCardConfirm: FC<ProductCardConfirmProps> = ({ product }) => {
    //
    return (
        <div className='flex h-auto min-w-full max-w-[400px] flex-col gap-3 rounded-[20px] bg-white p-6'>
            <div className='flex h-full w-full items-center justify-between'>
                <div className='flex w-full flex-col justify-center gap-[3px]'>
                    <div className='flex items-start justify-start space-x-2 justify-self-start'>
                        <Avatar className='h-[46px] w-[46px] border border-lynch-100'>
                            <AvatarImage
                                src={`https://random.imagecdn.app/300/300?${product.name}`}
                                sizes='46px'
                            />
                            <AvatarFallback>
                                {product.title && product.title[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <h1 className='text-lg'>{product.name}</h1>
                            <h3 className='text-sm text-mountain-400'>
                                {product.category.name}
                            </h3>
                            <div className='flex justify-start justify-items-center space-x-1.5 py-2 font-medium text-lynch-500'>
                                <CalendarClock size={18} />
                                <h3 className='text-sm'>
                                    {product.creationDate.split('T')[0]}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCardConfirm
