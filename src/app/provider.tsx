import { SignOut } from '@/actions'
import { auth, signOut } from '@/auth'
import QueryProvider from '@/components/layout/QueryProvider'
import { NotificationProvider } from '@/context/NotifContext'
import { SolutionsProvider } from '@/context/SolutionContext'
import { TitleProvider } from '@/context/TitleContext'
import { WebSocketProvider } from '@/context/UseSocket'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import PermissionProvider from '@/context/PermissionContext'





const Provider = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const session = await auth()
  console.log(
    'userRole: ',
    session?.user
  )
  return (
    <SessionProvider session={session}>
      <WebSocketProvider>
        <SolutionsProvider>
          <QueryProvider>
            <TitleProvider>
              <NotificationProvider>
                <PermissionProvider user={session?.user!}>
                  {children}
                  <Toaster />
                </PermissionProvider>
              </NotificationProvider>
            </TitleProvider>
          </QueryProvider>
        </SolutionsProvider>
      </WebSocketProvider>
    </SessionProvider>
  )
}

export default Provider
