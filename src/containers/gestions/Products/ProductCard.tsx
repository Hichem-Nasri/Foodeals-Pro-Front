import React, { FC } from 'react'
import { Calendar, CalendarClock, Eye, PencilLine } from 'lucide-react'
import { AppRoutes } from '@/lib/routes'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProductsType } from '@/types/product-type'
import { Separator } from '@/components/ui/separator'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import { PhoneBadge } from '@/components/utils/PhoneBadge'
import { EmailBadge } from '@/components/utils/EmailBadge'
import { useTranslations } from '@/hooks/useTranslations'

interface ProductCardProps {
  product: ProductsType
  archive: boolean
}

const ProductCard: FC<ProductCardProps> = ({ product, archive }) => {
  const { t } = useTranslations()
  
  return (
    <div className='flex h-auto min-w-full max-w-[400px] flex-col gap-3 rounded-[20px] bg-white p-6'>
      <div className='flex h-full w-full items-center justify-between'>
        <div className='flex w-full flex-col justify-center gap-[3px]'>
          <div className='flex items-start justify-start space-x-2 justify-self-start'>
            <Avatar className='h-[46px] w-[46px] border border-lynch-100'>
              <AvatarImage src={product.imageUrl} sizes='46px' />
              <AvatarFallback>
                {product.title && product.title[0]}
              </AvatarFallback>
            </Avatar>
            <div className='gap-4'>
              <h1 className='text-sm font-medium text-lynch-900'>
                {product.name}
              </h1>
              <h3 className='text-xs text-mountain-400'>
                {product.category.name}
              </h3>
              <div className='flex justify-start justify-items-center space-x-1.5 pt-2 text-lynch-500'>
                <CalendarClock size={16} />
                <h3 className='text-xs'>
                  {product.creationDate.split('T')[0]}
                </h3>
              </div>
            </div>
          </div>
        </div>
        {!archive && (
          <div className='flex w-full items-center justify-end gap-3'>
            <Link
              href={
                AppRoutes.productDetails.replace(':id', product.id) +
                '?mode=edit'
              }
              className='flex size-11 items-center justify-center rounded-full bg-lynch-300 text-white transition-colors hover:bg-lynch-500'
              title={t('products.edit')}
            >
              <PencilLine size={24} />
            </Link>
            <Link
              href={AppRoutes.productDetails.replace(':id', product.id)}
              className='flex size-11 items-center justify-center rounded-full bg-lynch-300 text-white transition-colors hover:bg-lynch-500'
              title={t('products.view')}
            >
              <Eye size={24} />
            </Link>
          </div>
        )}
      </div>
      <Separator className={'h-[0.55px] w-full bg-lynch-100'} />
      <div className='flex h-full w-full items-center justify-between'>
        <AvatarAndRole
          name={
            product?.createdBy?.name
              ? `${product.createdBy.name.firstName} ${product.createdBy.name.lastName}`
              : ''
          }
          avatar={product?.createdBy?.avatarPath}
          role='Admin'
          className='w-full'
          classNameAvatar='h-[46px] w-[46px] border border-lynch-100'
          classNameName='text-sm text-lynch-950 s w-full line-clamp-2'
        />
        <div className='flex w-full items-center justify-end gap-3'>
          <PhoneBadge phone={product.createdBy?.phone || ''} />
          <EmailBadge email={product.createdBy?.email || ''} />
        </div>
      </div>
    </div>
  )
}

export default ProductCard
