import { Layout } from '@/components/layout/Layout'
import React, { StrictMode } from 'react'
import MarketMobileBottomTabBar from './components/MarketMobileBottomTabBar'
import { getUser } from '@/actions'
import Provider from './provider'
import { Metadata } from 'next'

interface LayoutMarketProps {
  children: React.ReactNode
}

const metadata: Metadata = {
  title: 'Foodeals PRO Market',
  description: 'Foodeals PRO Market',
  icons: ['/favicon/favicon.svg'],
}

const LayoutMarket: React.FC<LayoutMarketProps> = async ({
  children,
}: Readonly<LayoutMarketProps>) => {
  const user = await getUser()
  return (
    <Layout>
      <StrictMode>
        <Provider user={user!}>
          <div className='mb-0 flex-1'>{children}</div>
          <div className='sticky bottom-0 left-0 z-40 w-full'>
            <MarketMobileBottomTabBar />
          </div>
        </Provider>
      </StrictMode>
    </Layout>
  )
}

export default LayoutMarket
