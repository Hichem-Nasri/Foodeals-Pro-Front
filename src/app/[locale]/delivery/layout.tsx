import '@/app/[locale]/delivery/delivery.css'
import DeliveryHeader from './components/DeliveryHeader'
import DeliveryMobileBottomTabBar from './components/DeliveryMobileBottomTabBar'
import DeliverySidenav from './components/DeliverySidenav'
import { Footer } from '@/components/layout/Footer'
import { getUser } from '@/actions'
import { Role, Roles } from '@/types/GlobalType'
import { UserRoleProvider } from '@/context/UserRoleContext'
import { DeliveryProvider } from '@/context/StoreDelivery'

export default async function DeliveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser()

  if (!user) return null

  return (
    <DeliveryProvider>
      <div className='wrapper flex h-full flex-col gap-y-2 bg-lynch-50'>
        <UserRoleProvider role={user.role} userId={user.id}>
          <DeliveryHeader
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              avatarPath: user.image || '',
              role: user.role,
            }}
          />
          <div className='content flex flex-[1] gap-x-2 overflow-hidden'>
            <DeliverySidenav />
            <main className='grow overflow-y-auto lg:pr-2'>{children}</main>
          </div>
          <Footer />
          <DeliveryMobileBottomTabBar />
        </UserRoleProvider>
      </div>
    </DeliveryProvider>
  )
}
