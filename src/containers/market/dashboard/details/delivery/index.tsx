'use client'
import React, { useState } from 'react'
import Switcher from './Switcher'
import UserCard from './UserCard'
import HeaderLine from '@/components/utils/HeaderLine'
import {
  NotificationType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import Grid from '@/components/utils/Grid'
import { getUser } from '@/actions'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api'
import { useNotification } from '@/context/NotifContext'
import Error from '@/app/[locale]/error'
import { useMarketTranslations } from '@/hooks/useTranslations'

interface indexProps {
  id: string
}

export type UserDelivery = {
  id: string
  name: {
    firstName: string
    lastName: string
  }
  avatarPath: string
  role: {
    id: string
    name: string
    authorities: string[]
  }
  phone: string
}

const DeliveryOrder: React.FC<indexProps> = ({ id }) => {
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [state, setState] = React.useState<'list' | 'localistion'>('list')
  const { notify } = useNotification()
  const t = useMarketTranslations()
  
  const handleClick = (id: string) => {
    console.log('id: ', id)
  }
  const { data, isLoading } = useQuery({
    queryKey: ['delivery', id, totals.currentPage, totals.pageSize],
    queryFn: async () => {
      const res = await api.get(
        `/users/collaborators/delivery-drivers?size=${totals.pageSize}&page=${totals.currentPage}`
      )
      if (res.status !== 200) {
        notify(NotificationType.ERROR, t('dashboard.delivery.errorLoadingDeliverers'))
        return null
      }
      setTotals((prev) => ({
        ...prev,
        totalPages: res.data.totalPages,
      }))
      const data: UserDelivery[] = res.data.content.map((user: any) => {
        return {
          id: user?.id.toString(),
          name: user?.name,
          avatarPath: user.avatarPath,
          role: {
            id: user.role.id,
            name: user.role.name,
            authorities: user.role.authorities,
          },
          phone: user.phone,
        }
      })
      return data
    },
  })
  return (
    <div className='flex w-full flex-col gap-y-4 px-4 lg:px-0'>
      <div className='flex w-full items-start justify-start rounded-[18px] bg-transparent p-2 lg:bg-white'>
        <Switcher state={state} setState={setState} disabled={false} />
      </div>
      <UserCard
        user={{
          name: {
            firstName: t('dashboard.delivery.foodealsDelivery'),
            lastName: '',
          },
          avatarPath: '/icons/foodeals-icon.svg',
          role: {
            id: '1',
            name: t('dashboard.delivery.deliverer'),
            authorities: [],
          },
          phone: '1234567890',
        }}
        withPhone={false}
        onClick={() => handleClick('foodeals')}
      />
      <HeaderLine title={t('dashboard.delivery.myDeliverers')} />
      {!data && !isLoading ? (
        <Error message={t('dashboard.delivery.errorLoadingDeliverers')} />
      ) : (
        <Grid isLoading={isLoading}>
          {data &&
            data?.map((user, index) => (
              <UserCard
                key={index}
                user={user}
                onClick={() => handleClick(user.id)}
              />
            ))}
        </Grid>
      )}
    </div>
  )
}

export const UsersDemo: Array<
  React.ComponentProps<typeof UserCard>['user']
> = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    avatarPath: 'https://picsum.photos/id/200/200/300',
    role: {
      id: '1',
      name: 'Livreur',
      authorities: [],
    },
    phone: '1234567890',
  },
  {
    name: {
      firstName: 'Alex',
      lastName: 'Jorden',
    },
    avatarPath: 'https://picsum.photos/id/201/200/300',
    role: {
      id: '2',
      name: 'Admin',
      authorities: [],
    },
    phone: '0987654321',
  },
  {
    name: {
      firstName: 'Mick',
      lastName: 'Ley',
    },
    avatarPath: 'https://picsum.photos/id/202/200/300',
    role: {
      id: '3',
      name: 'Client',
      authorities: [],
    },
    phone: '1234567890',
  },
]

export default DeliveryOrder
