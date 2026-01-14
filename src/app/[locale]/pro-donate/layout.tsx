import { Layout } from '@/components/layout/Layout'
import React from 'react'
import { Metadata } from 'next'
import DonateMobileBottomTabBar from '@/containers/donate/components/DonateMobileBottom'

interface LayoutMarketProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Foodeals Donate Pro',
  description: 'Foodeals PRO Donate',
  icons: ['/favicon/donate.svg'],
}

const LayoutMarket: React.FC<LayoutMarketProps> = async ({
  children,
}: Readonly<LayoutMarketProps>) => {
  return (
    <Layout>
      <div className='mb-0 flex-1'>{children}</div>
      <div className='sticky bottom-0 left-0 z-40 w-full'>
        <DonateMobileBottomTabBar />
      </div>
    </Layout>
  )
}

export default LayoutMarket
