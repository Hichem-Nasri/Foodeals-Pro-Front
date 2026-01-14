import { Suspense } from 'react'
import DeliveryMobileBottomTabBar from '../components/DeliveryMobileBottomTabBar'
import HomePageDelivery from './HomePageDelivery'
import {
  getSession,
  getUser,
} from '@/actions'

export default async function DeliveryPage({}: {}) {
  console.log(await getUser())
  return (
    <>
      <Suspense>
        <HomePageDelivery />
      </Suspense>
      {/* <DeliveryMobileBottomTabBar /> */}
    </>
  )
}
