import { Layout } from '@/components/layout/Layout'
import { ProductDlcProvider } from './_context/useProduct'
import DlcMobileBottomTabBar from '@/containers/pro_dlc/components/DlcMobileBottom'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Foodeals DLC',
  description: 'Foodeals DLC',
  icons: ['/favicon/dlc.svg', '/favicon/favicon.ico'],
}

export default function DeliveryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Layout>
      <ProductDlcProvider>
        <div className='mb-0 flex-1'>{children}</div>
        <div className='sticky bottom-0 left-0 z-40 w-full' id='dlc-mobile-bar'>
          <DlcMobileBottomTabBar />
        </div>
      </ProductDlcProvider>
    </Layout>
  )
}
