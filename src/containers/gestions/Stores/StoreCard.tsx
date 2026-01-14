import { FC, useState } from 'react'
import {
    Archive,
    Boxes,
    Building,
    CalendarClock,
    Eye,
    FileBadge,
    HandCoins,
    ListPlus,
    Mail,
    Pencil,
    PhoneCall,
    Store,
    Users,
    Users2,
} from 'lucide-react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { ActionType, ActionsMenu } from '@/components/custom/ActionsMenu'
import { CustomButton } from '@/components/custom/CustomButton'
import { capitalize } from '@/utils/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/custom/Label'
import {
    ArchiveType,
    NotificationType,
    PartnerEntitiesType,
    PartnerInfoDto,
} from '@/types/GlobalType'
import { StoresType } from '@/types/store-type'
import Archiver from '@/components/utils/Archiver'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { useNotification } from '@/context/NotifContext'
import { useStoresTranslations, useCommonTranslations } from '@/hooks/useTranslations'

interface StoreCardProps {
    store: StoresType
    refetch: () => void
    archive: boolean
}

export const StoreCard: FC<StoreCardProps> = ({ store, refetch, archive }) => {
    const router = useRouter()
    const notif = useNotification()
    const t = useStoresTranslations()
    const ct = useCommonTranslations()

    const dataArray = [
        {
            label: store.numberOfCollabs,
            icon: Users,
        },
        {
            label: `${t('offers')}: ${store.numberOfOffers}`,
            icon: Boxes,
        },
        {
            label: `${t('orders')}: ${store.numberOfOrders}`,
            icon: HandCoins,
        },
    ]

    const actions: ActionType[] = !archive
        ? [
              {
                  actions: (id) =>
                      router.push(
                          AppRoutes.storeDetails.replace(':id', store.id)
                      ),
                  icon: Eye,
                  label: t('view'),
              },
              {
                  actions: (id) =>
                      router.push(
                          AppRoutes.storeDetails.replace(':id', store.id) +
                              '?mode=edit'
                      ),
                  icon: Pencil,
                  label: t('edit').toUpperCase(),
              },
              {
                  actions: (id) => console.log('Contract'),
                  icon: FileBadge,
                  label: t('viewContract').toUpperCase(),
              },
              {
                  actions: (id) =>
                      router.push(
                          AppRoutes.collaborators.replace(':id', store.id)
                      ),
                  icon: Users2,
                  label: t('collaborators'),
              },
              {
                  actions: (id) => {
                      console.log('Archive')
                      refetch()
                  },
                  icon: Archive,
                  label: t('archive'),
                  archiveUrl: '/subentities/:id?motif=:motif&reason=:reason',
              },
          ]
        : []
    // const { mutate, isPending } = useMutation({
    //     mutationKey: ['archive', store.id],
    //     mutationFn: async (data: ArchiveType) => {
    //         const { motif, raison } = data
    //         const response = await api.delete(
    //             `/subentities/${store.id}?motif=${motif}&reason=${raison}`
    //         )
    //         return response.data
    //     },
    //     onSuccess: (data) => {
    //         notif.notify(NotificationType.SUCCESS, 'Archive avec succès')
    //         refetch()
    //         console.log(data)
    //     },
    //     onError: (err) => {
    //         notif.notify(NotificationType.ERROR, 'Erreur archivage')
    //         console.error(err)
    //     },
    // })
    // const handleArchive = (data: any) => {
    //     mutate(data)
    // }
    const name = capitalize(store.name)
    const date = new Date(store.creationDate).toISOString().split('T')[0]
    return (
        <div className='flex flex-col gap-3 rounded-[20px] bg-white p-3'>
            <div className='flex justify-between gap-[0.375rem]'>
                <div className='flex gap-[0.375rem]'>
                    <Avatar className='size-[2.875rem] shrink-0'>
                        <AvatarImage className='' src={store.avatarPath!} />
                        <AvatarFallback>
                            {name && name[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                        <Label
                            label={name}
                            className='text-sm font-normal text-lynch-950'
                        />
                        <Label
                            label={store.addressReponse.city.name}
                            className='text-xs font-medium text-primary'
                        />
                        <div className='flex items-center gap-2 text-lynch-500'>
                            <CalendarClock size={18} />
                            <Label
                                label={date}
                                className='text-xs font-medium text-lynch-500'
                            />
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-[0.375rem]'>
                    <Link href={`tel:${store.phone}`}>
                        <CustomButton
                            label=''
                            IconLeft={PhoneCall}
                            className='h-fit shrink-0 rounded-full p-[0.625rem] [&>.icon]:m-0'
                        />
                    </Link>
                    <Link href={`mailto:${store.email}`}>
                        <CustomButton
                            label=''
                            IconLeft={Mail}
                            className='h-fit shrink-0 rounded-full bg-amethyst-500 p-[0.625rem] [&>.icon]:m-0'
                        />
                    </Link>
                    <ActionsMenu
                        id={store.id}
                        menuList={actions}
                        className={`p-[0.625rem] [&>svg]:size-6 ${archive && 'bg-lynch-100'}`}
                    />
                </div>
            </div>
            <span className='h-[1px] w-full bg-lynch-100' />
            <div className='flex items-start gap-3'>
                <div className='flex flex-wrap gap-[0.375rem]'>
                    {dataArray.map((data, index) => (
                        <div
                            key={data.label + index.toString()}
                            className='flex gap-[0.375rem] rounded-full bg-lynch-100 px-3 py-[0.375rem] text-lynch-500'
                        >
                            <data.icon size={18} key={data.label} />
                            <Label
                                label={data.label.toString()}
                                className='text-lynch-500'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
