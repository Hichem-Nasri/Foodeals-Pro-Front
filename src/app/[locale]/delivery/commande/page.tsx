import { Suspense } from 'react'
import DeliveryMobileBottomTabBar from '../components/DeliveryMobileBottomTabBar'
import OrderPage from './components/OrderPage'

export default function CommandePage() {
  return (
    <>
      <Suspense>
        <OrderPage />
      </Suspense>
      {/* <DeliveryMobileBottomTabBar /> */}
    </>
  )
}
