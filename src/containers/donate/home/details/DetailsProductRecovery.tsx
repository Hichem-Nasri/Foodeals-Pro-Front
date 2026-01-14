'use client'

import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Separator } from '@/components/ui/separator'
import {
  Archive,
  Calendar,
  FileX,
  MapPin,
  QrCode,
  Timer,
  Truck,
  X,
} from 'lucide-react'
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
import { useRouter } from 'next/navigation'
import { DonateRoutes, MarketRoutes } from '@/lib/routes'
import Link from 'next/link'
import DialogCancelOrder from './CancelDonate'
import { Label } from '@/components/custom/Label'
import { format } from 'date-fns'
import { useDonateTranslations } from '@/hooks/useTranslations'

// type DetailsRecoveryT = {
//   id: string
//   RemindingDate: string | number | Date
//   totalQuanity: number
//   productImages: string[]
//   productName: string
//   description: string
//   price: PriceType
//   color?: ColorsT
//   managerDonorName: string
//   donorPhone: string
//   donorEmail: string
//   orderDate: string | number | Date
//   paymentMethod: PaymentMethodEnum
//   deliveryBoyName: string
//   deliveryBoyPhone: string
//   deliveryBoyEmail: string
//   deliveryAdress: string
//   deliveryPartenerName: string
//   deliveryCompanyAvatar: string
//   deliveryStatus: 'PENDING' | 'DELIVERED' | 'CANCELED'
//   modalityDelivery: string
//   motif: string
//   reason: string
//   attachement: string
// }
export interface DetailsRecoveryT {
  id: string
  quantity: number
  description: string
  motif: string
  reason: string
  attachement: string
  managerDonorName: string
  donorAvatar: string
  donorEmail: string
  donorPhone: string
  adressDonor: string
  deliveryPartenerName: string
  deliveryBoyName: string
  deliveryBoyPhone: string
  deliveryBoyEmail: string // add
  orderDate: string // add
  RemindingDate: string // add
  modalityDelivery: string
  deliveryAdress: string
  deliveryStatus: string
}

export default function DetailsProductRecovery({
  id,
  RemindingDate,
  quantity,
  description,
  donorEmail,
  managerDonorName,
  donorPhone,
  orderDate,
  deliveryBoyName,
  deliveryBoyEmail,
  deliveryBoyPhone,
  deliveryAdress,
  deliveryPartenerName,
  deliveryStatus,
  modalityDelivery,
  motif,
  reason,
  attachement,
  donateId,
}: DetailsRecoveryT & {
  donateId: string
}) {
  const [isCanceled, setIsCanceled] = React.useState(false)
  const t = useDonateTranslations()

  return (
    <div className='relative flex flex-col gap-4 lg:flex-col-reverse'>
      <div className='flex flex-col gap-5 max-lg:px-2'>
        {/* Quantity and Date-time */}
        <div className='flex items-center justify-between text-lynch-500 lg:hidden'>
          <div className='rounded-[48px] bg-scooter-100 px-3 py-2 font-semibold text-scooter-500'>
            {quantity} {t('productDetails.unitsLabel')}
          </div>
          <div className='flex items-center gap-1 rounded-full bg-scooter-500 px-2 py-1 font-medium text-white'>
            <Timer size={20} />
            {format(RemindingDate, 'HH:mm:ss') as string}
          </div>
        </div>

        {/* Preview Product images Carousel */}
        <div className='container-item'>
          <Label label={t('productDetails.productDescription')} />
          <p className='text-pretty rounded-[14px] bg-lynch-50 px-2 py-4 text-base font-medium text-lynch-500'>
            {description}
          </p>
        </div>

        {/* order price / partner / client */}
        <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
          {/* order price */}

          <div className='flex gap-3 max-lg:flex-col'>
            {/* Contact info */}
            <ContactInfoOrderDetails
              donorEmail={donorEmail}
              managerDonorName={managerDonorName}
              donorPhone={donorPhone}
              orderDate={orderDate}
            />
            {/* Delivery Info */}
            <DeliveryInfoDetails
              deliveryBoyName={deliveryBoyName}
              deliveryBoyPhone={deliveryBoyPhone}
              deliveryBoyEmail={deliveryBoyEmail}
              deliveryAdress={deliveryAdress}
              deliveryPartenerName={deliveryPartenerName}
              modalityDelivery={modalityDelivery}
              deliveryStatus={deliveryStatus}
            />
          </div>
        </div>
      </div>
      {deliveryStatus !== 'DELIVERED' && (
        <div className='bottom-0 flex justify-end gap-3 rounded-[30px] bg-white p-4 lg:sticky lg:top-0 lg:rounded-[24px] lg:p-2'>
          {deliveryStatus === 'PENDING' && (
            <>
              <CustomButton
                label={t('productDetails.cancelOrder')}
                variant='ghost'
                size={'sm'}
                className='border-2 border-coral-500 bg-coral-50 text-sm font-medium text-coral-500 max-lg:w-full'
                IconRight={X}
                onClick={() => {
                  setIsCanceled(true)
                }}
              />
              <Link
                href={DonateRoutes.delivery
                  .replace(':donateId', donateId)
                  .replace(':productId', id)}
                className='w-fit'
              >
                <CustomButton
                  label={t('productDetails.assignToDelivery')}
                  size={'sm'}
                  className='hidden items-center gap-3 bg-scooter-500 text-sm font-medium text-white hover:bg-scooter-100 hover:text-scooter-500 max-lg:w-full lg:flex'
                  IconRight={Truck}
                  onClick={() => {}}
                />
              </Link>
            </>
          )}
          {deliveryStatus === 'CANCELED' && (
            <CustomButton
              label={t('productDetails.viewCancellationReason')}
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
      {deliveryStatus !== 'CANCELED' && (
        <div className='sticky bottom-0 flex w-full flex-col gap-2 rounded-[30px] bg-white p-4 max-lg:rounded-b-none lg:hidden'>
          {deliveryStatus !== 'PENDING' && (
            <CustomButton
              label={t('productDetails.archive')}
              variant='outline'
              className='w-full lg:w-fit'
              onClick={() => {}}
              IconRight={Archive}
            />
          )}
          <Link
            href={DonateRoutes.delivery
              .replace(':donateId', donateId)
              .replace(':productId', id)}
            className='w-full lg:w-fit'
          >
            <CustomButton
              label={t('productDetails.assignToDelivery')}
              className='w-full bg-scooter-500 hover:bg-scooter-100 hover:text-scooter-500 lg:w-fit'
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
        donateId={donateId}
        disabled={deliveryStatus === 'CANCELED'}
        data={{
          motif: motif || '',
          content: reason || '',
          attachements: attachement || '',
        }}
      />
    </div>
  )
}

function ContactInfoOrderDetails({
  managerDonorName,
  donorEmail,
  donorPhone,
  orderDate,
}: Pick<
  DetailsRecoveryT,
  'managerDonorName' | 'donorEmail' | 'donorPhone' | 'orderDate'
>) {
  const t = useDonateTranslations()
  
  return (
    <div className='flex flex-1 flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1.5 text-lynch-950'>
            <h3 className='text-sm font-medium'>{t('productDetails.contactInfo')}</h3>
            <p className='text-base font-semibold'>{managerDonorName}</p>
          </div>
          <PhoneEmailButtons
            phone={donorPhone}
            email={donorEmail}
            icon='mail'
          />
        </div>
      </div>
      <Separator className='bg-lynch-200' />

      <div className='flex w-full text-sm font-medium text-lynch-500'>
        <div className='flex w-full flex-1 flex-col gap-2'>
          <h3 className='text-lynch-950'>{t('productDetails.date')}</h3>
          <div className='flex items-center gap-1.5'>
            <Calendar />
            <span>{format(orderDate, 'eee, MMMM d')}</span>
          </div>
        </div>
        <div className='flex w-full flex-1 flex-col gap-2'>
          <h3 className='text-lynch-950'>{t('productDetails.time')}</h3>
          <div className='flex items-center gap-1.5'>
            <Timer />
            <span>{format(orderDate, 'HH:mm')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeliveryInfoDetails({
  deliveryBoyName,
  deliveryBoyPhone,
  deliveryBoyEmail,
  deliveryAdress,
  deliveryPartenerName,
  deliveryStatus,
  modalityDelivery,
}: Pick<
  DetailsRecoveryT,
  | 'deliveryBoyName'
  | 'deliveryBoyPhone'
  | 'deliveryBoyEmail'
  | 'deliveryAdress'
  | 'deliveryPartenerName'
  | 'modalityDelivery'
  | 'deliveryStatus'
>) {
  const t = useDonateTranslations()
  
  return (
    <>
      <div className='flex flex-1 flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
        <div className='flex flex-col gap-3'>
          <AvatarAndName
            name={deliveryPartenerName || t('delivery.foodealsDelivery')}
            subtitle={t('productDetails.deliveryService')}
            classNameName='text-base font-semibold'
            classNameAvatar='size-[46px]'
            avatar='/icons/foodeals-icon.svg'
          />

          <Separator className='bg-lynch-200' />
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-1.5 text-lynch-950'>
              <h3 className='text-sm font-medium'>{t('productDetails.deliveryPersonInfo')}</h3>
              <p className='text-base font-semibold'>{deliveryBoyName}</p>
            </div>
            <PhoneEmailButtons
              phone={deliveryBoyPhone}
              email={deliveryBoyEmail}
              icon='mail'
            />
          </div>
        </div>
        <Separator className='bg-lynch-200' />

        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>{t('productDetails.consumptionMode')}</h3>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1.5'>
                {modalityDelivery == 'DELIVERY' ? (
                  <>
                    <Truck />
                    <span>{t('productDetails.delivery')}</span>
                  </>
                ) : (
                  <>
                    <MapPin />
                    <span>{t('productDetails.onSite')}</span>
                  </>
                )}
              </div>
              {deliveryStatus === 'DELIVERED' && (
                <div className='flex items-center gap-1.5 rounded-full bg-mountain-500 px-3 py-1.5 text-white'>
                  <QrCode size={14} />
                  <span className='text-[10px] font-bold uppercase'>{t('productDetails.received')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>{t('productDetails.deliveryAddress')}</h3>
            <div className='flex items-center gap-1.5'>
              <MapPin />
              <span>{deliveryAdress}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface DetailsProductRecoveryProps {}
