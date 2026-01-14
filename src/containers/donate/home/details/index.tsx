'use client'

import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Separator } from '@/components/ui/separator'
import { Archive, FileX, MapPin, QrCode, Truck, X } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import ShowDateTime from '@/components/tools/ShowDateTime'
import PreviewProductCarousel from '@/components/tools/PreviewProductCarousel'
import {
  PartnerSolutionType,
  PaymentMethodEnum,
  PriceType,
} from '@/types/GlobalType'
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
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import { RecoveryCardDetails } from '../../components/RecoveryCardDetails'
import { RecoveryDonateType } from '@/types/donate-type'
import DialogCancelOrder from './CancelDonate'
import Grid from '@/components/utils/Grid'
import SideButton from '../../components/SideBar'
import CreateDonateButton from '../../components/CreateDonateButton'
import { useDonateTranslations } from '@/hooks/useTranslations'

export interface RecoveryDetailsT {
  id: string
  managerDonorName: string
  donorName: string
  donorAvatar: string
  donorEmail: string
  donorPhone: string
  adressDonor: string
  deliveryPartenerName: string
  deliveryBoyName: string
  deliveryBoyPhone: string
  deliveryBoyEmail: string
  status: 'PENDING' | 'DELIVERED' | 'CANCELED'
  modalityDelivery: string
  deliveryAdress: string
  productsDonateResponse: ProductsDonateResponse[]
  donateDate: string
  totalQuantity: number
}

export interface ProductsDonateResponse {
  id: string
  avatarPath: string
  name: string
  description: string
}

export default function DonateDetails({
  id,
  managerDonorName,
  donorName,
  donorAvatar,
  donorEmail,
  donorPhone,
  adressDonor,
  deliveryPartenerName,
  deliveryBoyName,
  deliveryBoyPhone,
  deliveryBoyEmail,
  modalityDelivery,
  deliveryAdress,
  productsDonateResponse,
  donateDate,
  totalQuantity,
}: RecoveryDetailsT) {
  const [isCanceled, setIsCanceled] = React.useState(false)
  const router = useRouter()
  const tDonate = useDonateTranslations()

  return (
    <div className='relative flex flex-col gap-4 p-3 lg:flex-col-reverse lg:p-0'>
      <div className='flex flex-col gap-5 max-lg:px-2'>
        {/* Quantity and Date-time */}
        <div className='flex items-center justify-between text-lynch-500 lg:hidden'>
          <ShowDateTime
            date={donateDate}
            className='flex-col items-start text-lynch-500'
          />
          <div className='rounded-[48px] bg-white px-5 py-2.5 font-semibold'>
            x {totalQuantity}
          </div>
        </div>

        {/* order price / partner / client */}
        <div className='flex w-full flex-col gap-3 lg:flex-row'>
          <div className='flex w-full flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950 shadow-[0px_0px_10px_5px_#00000005]'>
            {/* order price */}
            <div className='hidden items-center justify-between rounded-[14px] bg-lynch-50 p-2 text-lynch-500 lg:flex'>
              <ShowDateTime
                date={donateDate}
                className='flex-col items-start text-lynch-500'
              />
              <div className='rounded-full bg-scooter-100 px-3 py-1 font-semibold text-scooter-500'>
                x {totalQuantity}
              </div>
            </div>
            <header className='w-full justify-between text-sm font-medium max-lg:flex'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex flex-col gap-1.5 text-lynch-950'>
                  <h3 className='text-sm font-medium'>
                    {tDonate('details.contactInfo')}
                  </h3>
                  <p className='text-base font-semibold'>{managerDonorName}</p>
                </div>
                <PhoneEmailButtons
                  phone={donorPhone}
                  email={donorEmail}
                  icon='mail'
                  color='blue'
                />
              </div>
            </header>

            <div className='flex gap-3 max-lg:flex-col'>
              {/* Contact info */}
              <ContactInfoDonateDetails
                address={adressDonor}
                association={donorName}
                associationImage={donorAvatar}
              />
              {/* Delivery Info */}
            </div>
          </div>
          <div className='flex w-full flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
            <DeliveryInfoDetails
              deliveryBoyName={deliveryBoyName}
              deliveryBoyPhone={deliveryBoyPhone}
              deliveryBoyEmail={deliveryBoyEmail}
              deliveryAdress={deliveryAdress}
              deliveryPartenerName={deliveryPartenerName}
              modalityDelivery={modalityDelivery}
            />
          </div>
        </div>
        <Grid>
          {productsDonateResponse?.map((product, index) => (
            <RecoveryCardDetails
              key={index}
              id={product.id}
              title={product.name}
              description={product.description}
              time={donateDate}
              solution={PartnerSolutionType.DLC_PRO}
              imageUrl={product.avatarPath}
              onClick={() =>
                router.push(DonateRoutes.home + '/' + id + '/' + product.id)
              }
            />
          ))}
        </Grid>
      </div>
      <CreateDonateButton />
    </div>
  )
}

function ContactInfoDonateDetails({
  address,
  association,
  associationImage,
}: {
  address: string
  association: string
  associationImage: string
}) {
  const tDonate = useDonateTranslations()
  
  return (
    <div className='flex flex-1 flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
      <div className='flex gap-3'>
        <AvatarAndRole
          avatar={associationImage}
          role={association}
          name={tDonate('details.associationInfo')}
          className='w-full'
          classNameAvatar='size-[46px] bg-lynch-400'
          classNameName='text-sm font-medium line-clamp-2 text-pretty'
          classNameRole='text-lynch-950 text-base font-semibold text-pretty'
        />
      </div>
      <div className='space-y-1'>
        <div className='flex text-sm font-medium text-lynch-950'>
          {tDonate('details.associationAddress')}
        </div>
        <div className='flex items-center gap-1.5 text-lynch-500'>
          <MapPin />
          <span>{address}</span>
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
  modalityDelivery,
}: Pick<
  RecoveryDetailsT,
  | 'deliveryBoyName'
  | 'deliveryBoyPhone'
  | 'deliveryBoyEmail'
  | 'deliveryAdress'
  | 'deliveryPartenerName'
  | 'modalityDelivery'
>) {
  const tDonate = useDonateTranslations()
  
  return (
    <>
      <div className='flex flex-1 flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
        <div className='flex flex-col gap-3'>
          <AvatarAndName
            name={deliveryPartenerName || 'Foodeals delivery'}
            subtitle={tDonate('details.deliveryService')}
            classNameName='text-base font-semibold'
            classNameAvatar='size-[46px]'
            avatar='/icons/foodeals-icon.svg'
          />

          <Separator className='bg-lynch-200' />
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-1.5 text-lynch-950'>
              <h3 className='text-sm font-medium'>{tDonate('details.deliveryPersonInfo')}</h3>
              <p className='text-base font-semibold'>{deliveryBoyName}</p>
            </div>
            <PhoneEmailButtons
              phone={deliveryBoyPhone}
              email={deliveryBoyEmail}
              icon='mail'
              color='blue'
            />
          </div>
        </div>
        <Separator className='bg-lynch-200' />

        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>{tDonate('details.consumptionMode')}</h3>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1.5'>
                {modalityDelivery == 'DELIVERY' ? (
                  <>
                    <Truck />
                    <span>{tDonate('details.delivery')}</span>
                  </>
                ) : (
                  <>
                    <MapPin />
                    <span>{tDonate('details.onSite')}</span>
                  </>
                )}
              </div>
              {status === 'DELIVERED' && (
                <div className='flex items-center gap-1.5 rounded-full bg-mountain-500 px-3 py-1.5 text-white'>
                  <QrCode size={14} />
                  <span className='text-[10px] font-bold uppercase'>{tDonate('details.received')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>{tDonate('details.deliveryAddress')}</h3>
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
