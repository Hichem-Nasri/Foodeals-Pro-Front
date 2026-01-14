'use client'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import TitleDevider from '@/components/utils/TitleDevider'
import { AccordionItem } from '@radix-ui/react-accordion'
import {
  CheckCheck,
  ListFilter,
  MessageCircleMore,
  PhoneCall,
} from 'lucide-react'

import MobileListRow from '../../components/MobileListRow'
import TopTabs, {
  TopTabsLinks,
} from '@/components/custom/TopTabs'
import {
  DeliveryManT,
  useGetDeliveryManList,
  useGetDeliveryManListByStatus,
} from '@/hooks/delivery/queries/delivery-men-queries'
import { useSearchParams } from 'next/navigation'
import LoadingPageSpinner from '@/components/custom/LoadingPageSpinner'
import { DeliveryManDetailsDrawer } from '../../components/Drawers'
import {
  Fragment,
  useState,
} from 'react'
import { useGetDelivOrderById } from '@/hooks/delivery/queries/orders-queries'
import { DeliveryManDetailsDialogDrawer } from '../../components/DeliveryManDetailsDialogDrawer'
import { SuccessDialog } from '../../components/Dialogs'
import { DeliveryRoutes } from '@/lib/routes'
import { DeliveryMapC } from '@/lib/delivery-classes'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

const extractDelivery: (
  delivey: DeliveryManT | null
) => DeliveryMapC = (delivey) => {
  // TODO: Get actual position from delivery man's last known location
  // For now, using placeholder - should come from API
  const ret: DeliveryMapC =
    new DeliveryMapC(
      delivey?.id || '',
      {
        name: delivey?.name!,
        email: delivey?.email!,
        phone: delivey?.phone!,
      },
      delivey?.position || {
        longitude: 0,
        latitude: 0,
      },
      delivey?.deliveryBoyAvailable
    )
  return ret
}

export default function DeliveryMenList({
  orderId,
}: {
  orderId: string
}) {
  const [openDrawer, setOpenDrawer] =
    useState(false)
  const [
    isSuccessDialogOpen,
    setIsSuccessDialogOpen,
  ] = useState(false)
  const [
    selectedDeliveryMan,
    setSelectedDeliveryMan,
  ] = useState<DeliveryManT | null>(
    null
  )
  const t = useDeliveryTranslations()
  
  // Get order data to extract delivery location
  const { data: orderData } = useGetDelivOrderById(orderId)
  
  // Use organization's default location or order's delivery address
  // TODO: Implement geocoding service to convert address to coordinates
  // For now using a default location - should be replaced with actual coordinates
  const deliveryLocation = orderData ? {
    latitude: 33.5731,  // TODO: Geocode from orderData.deliveryAdress
    longitude: -7.5898,
  } : { latitude: 33.5731, longitude: -7.5898 }
  
  const { isLoading, data, error } =
    useGetDeliveryManListByStatus(deliveryLocation)
  // ?---------------------

  if (isLoading) {
    return <LoadingPageSpinner />
  }

  if (error) {
    return <pre>{error.message}</pre>
  }

  if (data)
    return (
      <>
        <TopTabsLinks
          tabs={[
            {
              label: t('navigation.deliveryMen'),
              href: orderId
                ? `${DeliveryRoutes.livreurs}?${new URLSearchParams({ orderId }).toString()}`
                : DeliveryRoutes.livreurs,
              isActive: true,
            },
            {
              label: 'Localisations',
              href: orderId
                ? `/delivery/map/delivery-men?${new URLSearchParams({ orderId }).toString()}`
                : '/delivery/map/delivery-men',
              isActive: false,
            },
          ]}
          activeColor='purple'
        />
        <div>
          <div className='flex justify-between'>
            <h2 className='flex items-center gap-3 text-[22px] font-medium'>
              {t('deliveryMen.title')}
            </h2>
            <div className='flex gap-3'>
              <Button className='size-14 rounded-full bg-white p-0 text-lynch-400 hover:bg-lynch-100 hover:text-lynch-500'>
                <ListFilter className='text-lynch-400' />
              </Button>
            </div>
          </div>
          {data.map((item) => (
            <Fragment
              key={item.category}
            >
              {item.members.length >
                0 && (
                <Accordion
                  type='single'
                  collapsible
                  className='w-full'
                  key={item.category}
                  defaultValue={`${item.category}-item-1`}
                >
                  <AccordionItem
                    value={`${item.category}-item-1`}
                  >
                    <AccordionTrigger classNameArrow='text-lynch-300 size-6'>
                      <TitleDevider
                        position='left'
                        title={
                          item.category
                        }
                        className='font-normal text-lynch-400'
                      />
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className='grid grid-cols-1 gap-3 lg:grid-cols-3'>
                        {item.members.map(
                          (
                            member,
                            i
                          ) => (
                            <MobileListRow
                              key={
                                member.id
                              }
                              name={`${member.name.firstName} ${member.name.lastName}`}
                              avatarPath={
                                member.avatarPath
                              }
                              avatarSubtitle={
                                member.distanceOfDeliveryBoy &&
                                member.deliveryBoyAvailable
                                  ? `Distance ${member.distanceOfDeliveryBoy}Km`
                                  : t('deliveryMen.deliverers')
                              }
                              classNameSubtitle={
                                item.category ===
                                'Disponible'
                                  ? 'text-amethyst-500'
                                  : ''
                              }
                              buttons={deliveryMenListItemButtons(
                                {
                                  email:
                                    member.email,
                                  phone:
                                    member.phone,
                                  cb: () => {
                                    setSelectedDeliveryMan(
                                      member
                                    )
                                    setOpenDrawer(
                                      true
                                    )
                                  },
                                  orderId,
                                }
                              )}
                            />
                          )
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </Fragment>
          ))}
          {orderId && (
            <DeliveryManDetailsDialogDrawer
              orderId={orderId}
              deliveryMan={extractDelivery(
                selectedDeliveryMan
              )}
              open={openDrawer}
              setOpen={setOpenDrawer}
              deliveryPos={deliveryLocation}
              showSuccessDialog={() => {
                setIsSuccessDialogOpen(
                  true
                )
                setTimeout(() => {
                  setIsSuccessDialogOpen(
                    false
                  )
                }, 5000)
              }}
              selected
            />
          )}
          <SuccessDialog
            isOpen={isSuccessDialogOpen}
            setIsOpen={
              setIsSuccessDialogOpen
            }
            content='La commande a été affecté avec succès'
          />
        </div>
      </>
    )
}

function deliveryMenListItemButtons({
  phone,
  cb,
  email,
  orderId,
}: {
  phone: string
  email: string
  orderId: string | null
  cb: () => void
}) {
  return [
    {
      type: 'Link' as const,
      Icon: PhoneCall,
      href: `tel:${phone}`,
    },
    {
      type: 'Link' as const,
      Icon: MessageCircleMore,
      href: `mailto:${email}`,
    },
    ...(orderId
      ? [
          {
            type: 'Button' as const,
            Icon: CheckCheck,
            onClick: cb,
          },
        ]
      : []),
  ]
}
