'use client'

import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Separator } from '@/components/ui/separator'
import { Archive, FileX, MapPin, QrCode, Truck, X } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import ShowDateTime from '@/components/tools/ShowDateTime'
import PreviewProductCarousel from '@/components/tools/PreviewProductCarousel'
import { PaymentMethodEnum, PriceType } from '@/types/GlobalType'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import DateDayNameMonthDayNumber from '@/components/tools/DateDayNameMonthDayNumber'
import PhoneEmailButtons from '@/components/tools/PhoneEmailButons'
import PaymentMethod from '@/components/tools/PaymentMethod'
import { CustomButton } from '@/components/custom/CustomButton'
import DialogCancelOrder from './CancelOrder'
import { useRouter } from 'next/navigation'
import { MarketRoutes } from '@/lib/routes'
import Link from 'next/link'
import { useMarketTranslations } from '@/hooks/useTranslations'

type OrderDetailsT = {
  id: string
  creationDate: string | number | Date
  totalQuanity: number
  productImages: string[]
  productName: string
  productDescription: string
  price: PriceType
  color?: ColorsT
  contactName: string
  contactPhone: string
  contactEmail: string
  orderDate: string | number | Date
  paymentMethod: PaymentMethodEnum
  deliveryManName: string
  deliveryManPhone: string
  deliveryManEmail: string
  destinationAddress: string
  deliveryCompanyName: string
  deliveryCompanyAvatar: string
  status: 'PENDING' | 'DELIVERED' | 'CANCELED'
  modality: string
  cancellationReason: string
  cancellationSubject: string
  attachements: string
}

export default function OrdersDetails({
  id,
  creationDate,
  totalQuanity,
  productImages,
  productName,
  productDescription,
  price,
  color = 'green',
  contactEmail,
  contactName,
  contactPhone,
  orderDate,
  paymentMethod,
  deliveryManName,
  deliveryManEmail,
  deliveryManPhone,
  destinationAddress,
  deliveryCompanyName,
  deliveryCompanyAvatar,
  status,
  modality,
  cancellationReason,
  cancellationSubject,
  attachements,
}: OrderDetailsT) {
  const [isCanceled, setIsCanceled] = React.useState(false)
  const router = useRouter()
  const t = useMarketTranslations()
  
  return (
    <div className='relative flex flex-col gap-4 lg:flex-col-reverse'>
      <div className='flex flex-col gap-5 max-lg:px-2'>
        {/* Quantity and Date-time */}
        <div className='flex items-center justify-between text-lynch-500 lg:hidden'>
          <ShowDateTime
            date={creationDate}
            className='flex-col items-start text-lynch-500'
          />
          <div className='rounded-[48px] bg-white px-5 py-2.5 font-semibold'>
            x {totalQuanity}
          </div>
        </div>

        {/* Preview Product images Carousel */}
        <div className='flex flex-col gap-5 lg:flex-row'>
          <div className='flex flex-1 justify-center rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
            <PreviewProductCarousel
              images={productImages.map((item) => '/images/' + item)}
              color={color}
            />
          </div>
          <div className='flex flex-1 flex-col gap-5'>
            {/* Order name */}
            <div className='flex flex-1 flex-grow flex-col gap-6 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
              <div className='flex flex-col gap-3'>
                <h2 className='text-sm font-medium'>{t('dashboard.details.productName')}</h2>
                <div className='rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
                  <p>{productName}</p>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <h2 className='text-sm font-medium'>{t('dashboard.details.productDescription')}</h2>
                <div className='rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
                  <p>{productDescription}</p>
                </div>
              </div>

              <div className='hidden justify-between justify-items-end text-sm font-medium lg:flex'>
                <h2>{t('dashboard.details.orderPrice')}</h2>
                <span
                  className={cn(
                    'text-[22px] font-semibold',
                    getActiveColorClassName(color)
                  )}
                >
                  {`${price.amount} ${price.currency}`}
                </span>
              </div>
            </div>

            {/* Ordered quantity */}
          </div>
        </div>
        {/* order price / partner / client */}
        <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
          {/* order price */}
          <header className='hidden justify-between text-sm font-medium max-lg:flex'>
            <h2>{t('dashboard.details.orderPrice')}</h2>
            <span
              className={cn(
                'text-[22px] font-semibold',
                getActiveColorClassName(color)
              )}
            >
              {`${price.amount} ${price.currency}`}
            </span>
          </header>

          <div className='flex gap-3 max-lg:flex-col'>
            {/* Contact info */}
            <ContactInfoOrderDetails
              contactEmail={contactEmail}
              contactName={contactName}
              contactPhone={contactPhone}
              orderDate={orderDate}
              paymentMethod={paymentMethod}
            />

            {/* Delivery Info */}
            <DeliveryInfoDetails
              deliveryManName={deliveryManName}
              deliveryManPhone={deliveryManPhone}
              deliveryManEmail={deliveryManEmail}
              destinationAddress={destinationAddress}
              deliveryCompanyName={deliveryCompanyName}
              deliveryCompanyAvatar={deliveryCompanyAvatar}
              modality={modality}
              status={status}
            />
          </div>
        </div>
      </div>
      {status !== 'DELIVERED' && (
        <div className='bottom-0 flex justify-end gap-3 rounded-[30px] bg-white p-4 lg:sticky lg:top-0 lg:rounded-[24px] lg:p-2'>
          {status === 'PENDING' && (
            <>
              <CustomButton
                label={t('dashboard.details.cancelOrder')}
                variant='ghost'
                size={'sm'}
                className='border-2 border-coral-500 bg-coral-50 text-sm font-medium text-coral-500 max-lg:w-full'
                IconRight={X}
                onClick={() => {
                  setIsCanceled(true)
                }}
              />
              <Link
                href={
                  MarketRoutes.marketDetails.replace(':id', id) + '/delivery'
                }
                className='w-fit'
              >
                <CustomButton
                  label={t('dashboard.details.assignToDelivery')}
                  size={'sm'}
                  className='hidden items-center gap-3 text-sm font-medium text-white max-lg:w-full lg:flex'
                  IconRight={Truck}
                  onClick={() => {}}
                />
              </Link>
            </>
          )}
          {status === 'CANCELED' && (
            <CustomButton
              label={t('dashboard.details.viewCancellationReason')}
              variant='destructive'
              className='border-2 border-coral-500 bg-coral-50 text-sm font-medium text-coral-500 hover:bg-coral-100 max-lg:w-full'
              size={'sm'}
              IconRight={FileX}
              onClick={() => {
                setIsCanceled(true)
              }}
            />
          )}
        </div>
      )}
      {status !== 'CANCELED' && (
        <div className='sticky bottom-0 flex w-full flex-col gap-2 rounded-[30px] bg-white p-4 max-lg:rounded-b-none lg:hidden'>
          {status !== 'PENDING' && (
            <CustomButton
              label={t('dashboard.details.archive')}
              variant='outline'
              className='w-full lg:w-fit'
              onClick={() => {}}
              IconRight={Archive}
            />
          )}
          <Link
            href={MarketRoutes.marketDetails.replace(':id', id) + '/delivery'}
            className='w-full lg:w-fit'
          >
            <CustomButton
              label={t('dashboard.details.assignToDelivery')}
              className='w-full lg:w-fit'
              IconRight={Truck}
              onClick={() => {}}
            />
          </Link>
        </div>
      )}
      <DialogCancelOrder
        open={isCanceled}
        setOpen={setIsCanceled}
        id={id}
        disabled={status === 'CANCELED'}
        data={{
          motif: cancellationReason || '',
          content: cancellationSubject || '',
          attachements: attachements || '',
        }}
      />
    </div>
  )
}

function ContactInfoOrderDetails({
  contactName,
  contactEmail,
  contactPhone,
  orderDate,
  paymentMethod,
}: Pick<
  OrderDetailsT,
  | 'contactName'
  | 'contactEmail'
  | 'contactPhone'
  | 'orderDate'
  | 'paymentMethod'
>) {
  const t = useMarketTranslations()
  
  return (
    <div className='flex flex-1 flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1.5 text-lynch-950'>
            <h3 className='text-sm font-medium'>{t('dashboard.details.contactInfo')}</h3>
            <p className='text-base font-semibold'>{contactName}</p>
          </div>
          <PhoneEmailButtons
            phone={contactPhone}
            email={contactEmail}
            icon='mail'
          />
        </div>
      </div>
      <Separator className='bg-lynch-200' />

      <div className='flex text-sm font-medium text-lynch-500'>
        <DateDayNameMonthDayNumber date={orderDate} />

        <PaymentMethod type={paymentMethod} />
      </div>
    </div>
  )
}

function DeliveryInfoDetails({
  deliveryManName,
  deliveryManPhone,
  deliveryManEmail,
  destinationAddress,
  deliveryCompanyName,
  deliveryCompanyAvatar,
  status,
  modality,
}: Pick<
  OrderDetailsT,
  | 'deliveryManName'
  | 'deliveryManPhone'
  | 'deliveryManEmail'
  | 'destinationAddress'
  | 'deliveryCompanyName'
  | 'deliveryCompanyAvatar'
  | 'modality'
  | 'status'
>) {
  const t = useMarketTranslations()
  
  return (
    <>
      <div className='flex flex-1 flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
        <div className='flex flex-col gap-3'>
          <AvatarAndName
            name={deliveryCompanyName}
            subtitle={t('dashboard.details.deliveryService')}
            classNameName='text-base font-semibold'
            classNameAvatar='size-[46px]'
            avatar={deliveryCompanyAvatar}
          />

          <Separator className='bg-lynch-200' />
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-1.5 text-lynch-950'>
              <h3 className='text-sm font-medium'>{t('dashboard.details.deliveryPersonInfo')}</h3>
              <p className='text-base font-semibold'>{''}</p>
            </div>
            <PhoneEmailButtons
              phone={deliveryManPhone}
              email={deliveryManEmail}
              icon='mail'
            />
          </div>
        </div>
        <Separator className='bg-lynch-200' />

        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>{t('dashboard.details.consumptionMode')}</h3>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1.5'>
                {modality == 'DELIVERY' ? (
                  <>
                    <Truck />
                    <span>{t('dashboard.details.delivery')}</span>
                  </>
                ) : (
                  <>
                    <MapPin />
                    <span>{t('dashboard.details.onSite')}</span>
                  </>
                )}
              </div>
              {status === 'DELIVERED' && (
                <div className='flex items-center gap-1.5 rounded-full bg-mountain-500 px-3 py-1.5 text-white'>
                  <QrCode size={14} />
                  <span className='text-[10px] font-bold uppercase'>{t('dashboard.details.received')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>{t('dashboard.details.deliveryAddress')}</h3>
            <div className='flex items-center gap-1.5'>
              <MapPin />
              <span>{destinationAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
