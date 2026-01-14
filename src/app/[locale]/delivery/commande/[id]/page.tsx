'use client'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGetDelivOrderById } from '@/hooks/delivery/queries/orders-queries'
import { useDeliveryTranslations } from '@/hooks/useTranslations'
import {
  Banknote,
  Calendar,
  CalendarDays,
  CheckCheck,
  ChevronLeft,
  Clock,
  CreditCard,
  HandCoins,
  LoaderCircle,
  MapPin,
  MessageCircleMore,
  PhoneCall,
  Timer,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import React, {
  use,
  useEffect,
} from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { DeliveryRoutes } from '@/lib/routes'
import { AddZeroInfrontOfNumber } from '@/utils/utils'
import { format } from 'date-fns'
import SubPageHeader from '../../components/SubPageHeader'
import { PaymentMethod } from '@/types/payment-types'
import {
  Name,
  PaymentMethodEnum,
  PriceType,
  Roles,
} from '@/types/GlobalType'
import LoadingPageSpinner from '@/components/custom/LoadingPageSpinner'
import { useUserRole } from '@/context/UserRoleContext'
import MobileHeader from '@/components/utils/MobileHeader'
import { getUser } from '@/actions'
import { User } from 'next-auth'
// import FixedBottomWrapper from '@/components/utils/FixedBottomWrapper'

type OrderDetailsT = {
  params: Promise<{
    id: string
  }>
}

export default function CommandeDetails({
  params,
}: OrderDetailsT) {
  const { id } = use(params)
  const {
    data: orderDetails,
    isLoading,
    error,
  } = useGetDelivOrderById(id)
  const { role } = useUserRole()
  const t = useDeliveryTranslations()
  const [user, setUser] =
    React.useState<User | null>(null)
  const affected = false

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  if (isLoading) {
    return <LoadingPageSpinner />
  }

  if (error) {
    return <pre>{error.message}</pre>
  }

  if (
    !error &&
    !isLoading &&
    orderDetails
  ) {
    return (
      <div className='relative flex flex-col gap-5'>
        <MobileHeader header='Détail du produit' />
        <div className='flex flex-col gap-5 max-lg:px-2 lg:flex-col-reverse'>
          {/* Quantity and Date-time */}
          <div className='flex flex-col gap-5 max-lg:px-2'>
            <div className='flex items-center justify-between text-lynch-500'>
              <div className='flex flex-col gap-1.5 text-sm font-medium'>
                <div className='flex items-center gap-1'>
                  <CalendarDays
                    size={16}
                  />
                  <span>
                    {format(
                      orderDetails.orderDate,
                      'dd/MM/yyyy'
                    )}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock size={16} />
                  <span>
                    {format(
                      orderDetails.orderDate,
                      "HH'h' mm"
                    )}
                  </span>
                </div>
              </div>
              <div className='rounded-[48px] bg-white px-5 py-2.5 font-semibold'>
                x{' '}
                {orderDetails.quantity ||
                  0}
              </div>
            </div>

            {/* Preview Product images Carousel */}
            <div className='flex flex-col gap-5 lg:flex-row'>
              <div className='flex flex-1 justify-center rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
                <PreviewProductCarousel
                  images={orderDetails.photosProducts.map(
                    (p) =>
                      `/images/${p}`
                  )} // todo fix this later
                />
              </div>
              <ProductDetails
                title={
                  orderDetails.title
                }
                description={
                  orderDetails.description
                }
                quantity={
                  orderDetails.quantityOfOrder ||
                  0
                }
                price={
                  orderDetails.priceOrder
                }
              />
            </div>

            {/* order price / partner / client */}
            <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
              {/* order price */}
              <OrderPrice
                price={
                  orderDetails.priceOrder
                }
                className='lg:hidden'
              />

              <div className='flex flex-col gap-3 lg:flex-row'>
                {/* partner */}
                <PartnerDetails
                  name={
                    orderDetails.sellerName
                  }
                  avatar={
                    orderDetails.sellerAvatar
                  }
                  subtitleActivity={
                    orderDetails.sellerActivity ||
                    ''
                  }
                  phone={
                    orderDetails.deliveryBoyPhone
                  }
                  email={
                    orderDetails.deliveryBoyEmail
                  }
                  date={
                    orderDetails.orderDate
                  }
                  paymentMethod={
                    orderDetails.typePayment
                  }
                  address={
                    orderDetails.deliveryAdress
                  }
                />

                {/* client */}
                <ClientDetails
                  name={`${orderDetails.client.firstName} ${orderDetails.client.lastName}`}
                  avatar={
                    orderDetails.clientAvatar ||
                    ''
                  }
                  subtitleActivity={
                    orderDetails.clientActivity ||
                    ''
                  }
                  phone={
                    orderDetails.phoneClient
                  }
                  email={
                    orderDetails.emailClient
                  }
                  date={
                    orderDetails.orderDate
                  }
                  paymentMethod={
                    orderDetails.typePayment
                  }
                  address={
                    orderDetails.deliveryAdress
                  }
                  contactName='Amine El Sanhaji'
                />
              </div>
            </div>
          </div>

          {/* <FixedBottomWrapper> */}
          {/* </FixedBottomWrapper> */}
          <div className='lg-rounded-[18px] sticky bottom-0 flex items-center justify-center gap-2.5 rounded-3xl bg-white p-3 max-lg:rounded-bl-none max-lg:rounded-br-none lg:top-0 lg:justify-end lg:shadow-[#434E610F_0px_-5px_15px]'>
            {affected ? (
              <Button className='flex-1 gap-3 border-2 border-amethyst-500 bg-amethyst-50 font-medium uppercase text-amethyst-500 hover:bg-amethyst-100'>
                <span>
                  LOCALISATION
                </span>
                <MapPin />
              </Button>
            ) : (
              <>
                {role ===
                Roles.DELIVERY_MAN ? (
                  <Link
                    href={
                      DeliveryRoutes.deliveryMap +
                      '?orderId=' +
                      id +
                      '&deliveryManId=' +
                      user?.id
                    }
                  >
                    <Button className='h-14 w-full gap-3 bg-amethyst-500 font-medium uppercase hover:bg-amethyst-100 hover:text-amethyst-500 lg:h-12 lg:w-fit'>
                      <span>
                        ACCEPTER
                      </span>
                      <CheckCheck />
                    </Button>
                  </Link>
                ) : (
                  <Button className='h-14 w-full gap-3 bg-amethyst-500 font-medium uppercase hover:bg-amethyst-100 hover:text-amethyst-500 lg:h-12 lg:w-fit'>
                    <span>
                      Affecter
                    </span>
                    <Users />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }
  return null
}

function PreviewProductCarousel({
  images,
}: {
  images: string[]
}) {
  const [api, setApi] =
    React.useState<CarouselApi>()
  const [current, setCurrent] =
    React.useState(0)
  const [count, setCount] =
    React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(
      api.scrollSnapList().length
    )
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(
        api.selectedScrollSnap()
      )
    })
  }, [api])

  return (
    <div className='w-full'>
      <Carousel
        className='w-full overflow-hidden rounded-2xl max-[500px]:max-w-96 max-[420px]:max-w-[300px]'
        // className='w-full overflow-hidden rounded-2xl'
        setApi={setApi}
      >
        <CarouselContent>
          {images.map(
            (imgSrc, index) => (
              <CarouselItem
                key={index}
                // className='basis-full lg:basis-1/2 xl:basis-1/3'
                className='basis-full'
              >
                <div className='p-1'>
                  <div className='relative flex aspect-[33/25] items-center justify-center overflow-hidden rounded-2xl p-6'>
                    <Image
                      src={imgSrc}
                      fill
                      className='object-cover'
                      alt={''}
                    />
                  </div>
                </div>
              </CarouselItem>
            )
          )}
        </CarouselContent>
      </Carousel>
      <div className='flex justify-center gap-[9px] pt-4'>
        {Array.from({
          length: count,
        }).map((_, index) => (
          <button
            key={index}
            onClick={() =>
              api?.scrollTo(index)
            }
            className={cn(
              'size-[13px] rounded-full transition-colors',
              current === index
                ? 'bg-amethyst-500'
                : 'bg-lynch-200'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function DatePaymentAddressDetails({
  date,
  paymentMethod,
  address,
}: {
  date: string | Date | null
  paymentMethod: PaymentMethodEnum
  address: string | null
}) {
  return (
    <>
      <div className='flex text-sm font-medium text-lynch-500'>
        {date && (
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>
              Date
            </h3>
            <div className='flex items-center gap-1.5'>
              <Calendar />
              <span>
                {format(
                  date,
                  'eee, MMMM d'
                )}
              </span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Timer />
              <span>
                {format(date, 'HH:mm')}
              </span>
            </div>
          </div>
        )}
        <div className='flex flex-1 flex-col gap-2'>
          <h3 className='text-lynch-950'>
            Paiement par
          </h3>
          <div className='flex items-center gap-1.5'>
            {paymentMethod ===
              PaymentMethodEnum.CARD && (
              <>
                <CreditCard />
                <span>
                  Carte bancaire
                </span>
              </>
            )}

            {paymentMethod ===
              PaymentMethodEnum.CASH && (
              <>
                <Banknote />
                <span>Espèces</span>
              </>
            )}
          </div>
        </div>
      </div>
      {address && (
        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>
              Adresse de livraison
            </h3>
            <div className='flex items-center gap-1.5'>
              <MapPin />
              <span>{address}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PhoneEmailButtons({
  email,
  phone,
}: {
  phone: string | null
  email: string | null
}) {
  return (
    <div className='flex gap-1.5'>
      {phone && (
        <Button
          asChild
          className='flex size-11 items-center justify-center rounded-full p-0'
        >
          <Link href={`tel:${phone}`}>
            <PhoneCall />
          </Link>
        </Button>
      )}
      {email && (
        <Button
          asChild
          className='flex size-11 items-center justify-center rounded-full bg-amethyst-500 p-0 hover:bg-amethyst-500/80'
        >
          <Link
            href={`mailto:${email}`}
          >
            <MessageCircleMore />
          </Link>
        </Button>
      )}
    </div>
  )
}

type PartnerClientDetailsProps = {
  name: string
  avatar?: string
  phone: string | null
  email: string | null
  date: string
  paymentMethod: PaymentMethodEnum
  address: string | null
  subtitleActivity?: string
  contactName?: string
}

function PartnerDetails({
  name,
  phone,
  email,
  avatar,
  address,
  date,
  paymentMethod,
  subtitleActivity,
}: PartnerClientDetailsProps) {
  const t = useDeliveryTranslations()
  
  return (
    <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500 lg:flex-1'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-medium text-amethyst-500'>
          {t('orderDetails.partner')}
        </h3>

        <div className='flex items-center justify-between'>
          <AvatarAndName
            name={name}
            avatar={avatar}
            subtitle={subtitleActivity}
            classNameAvatar='size-[46px]'
            classNameName='font-semibold text-base'
          />
          <PhoneEmailButtons
            phone={phone}
            email={email}
          />
        </div>
      </div>
      <Separator className='bg-lynch-200' />
      <DatePaymentAddressDetails
        date={date}
        paymentMethod={paymentMethod}
        address={address}
      />
    </div>
  )
}

function ClientDetails({
  name,
  address,
  date,
  email,
  paymentMethod,
  phone,
  avatar,
  subtitleActivity,
  contactName,
}: PartnerClientDetailsProps) {
  const t = useDeliveryTranslations()
  
  return (
    <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500 lg:flex-1'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-sm font-medium text-amethyst-500'>
          {t('orderDetails.client')}
        </h3>

        <div className='flex items-center justify-between'>
          <AvatarAndName
            name={name}
            avatar={avatar}
            subtitle={subtitleActivity}
            classNameAvatar='size-[46px]'
            classNameName='font-semibold text-base'
          />
        </div>
      </div>

      {contactName && (
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-2.5 text-lynch-950'>
            <p className='text-sm font-medium'>
              {t('orderDetails.contact')}
            </p>
            <p className='font-semibold'>
              {contactName}
            </p>
          </div>
          <PhoneEmailButtons
            phone={phone}
            email={email}
          />
        </div>
      )}
      <Separator className='bg-lynch-200' />

      <DatePaymentAddressDetails
        date={date}
        paymentMethod={paymentMethod}
        address={address}
      />
    </div>
  )
}

function OrderPrice({
  price,
  className = '',
}: {
  price: PriceType
  className?: string
}) {
  const t = useDeliveryTranslations()
  
  return (
    <div
      className={cn(
        'flex justify-between text-sm font-medium',
        className
      )}
    >
      <h2>{t('orderDetails.orderPrice')}</h2>
      <span className='text-[22px] font-semibold text-amethyst-500'>
        {`${price.amount} ${price.currency}`}
      </span>
    </div>
  )
}

function ProductDetails({
  title,
  description,
  price,
  quantity,
}: {
  title: string
  description: string
  quantity: number
  price: PriceType
}) {
  const t = useDeliveryTranslations()
  
  return (
    <div className='flex flex-1 flex-col justify-start gap-2 rounded-[30px] bg-transparent lg:bg-white'>
      <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
        <header className='text-sm font-medium'>
          <h2>{t('orderDetails.productName')}</h2>
        </header>
        <div className='rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
          <p>{title}</p>
        </div>
      </div>

      {/* Order Description */}
      <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
        <header className='text-sm font-medium'>
          <h2>{t('orderDetails.description')}</h2>
        </header>
        <div className='h-full flex-1 rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
          <p>{description}</p>
        </div>
      </div>

      {/* Ordered quantity */}
      <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
        <header className='text-sm font-medium'>
          <h2>{t('orderDetails.quantity')}</h2>
        </header>

        {/* // todo ask hichem to add ordered quantity */}
        <div className='rounded-xl bg-lynch-50 px-3 py-4 text-center text-lynch-500'>
          <p>
            {AddZeroInfrontOfNumber(
              quantity
            )}
          </p>
        </div>
      </div>

      {/* price */}
      <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 py-6 text-lynch-950'>
        <OrderPrice
          price={price}
          className='max-lg:hidden'
        />
      </div>
    </div>
  )
}
