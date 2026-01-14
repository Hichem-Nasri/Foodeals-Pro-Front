'use client'
import { useNotification } from '@/context/NotifContext'
import { useSolutions } from '@/context/SolutionContext'
import { NotificationType, PartnerSolutionType } from '@/types/GlobalType'
import { User } from 'next-auth'
import React from 'react'

interface ProviderProps {
  user: User
  children: React.ReactNode
}

const Provider: React.FC<ProviderProps> = ({ user, children }) => {
  const { ChangeSolution, solution } = useSolutions()
  // const {notify} = useNotification()
  // if (!user.solutions.includes('pro_market')) {
  // 	notify(NotificationType.ERROR, 'You are not allowed to access this page')
  // 	ChangeSolution(PartnerSolutionType.NONE)
  // }//TODO: uncomment this
  // else {
  // if (solution.solution !== PartnerSolutionType.MARKET_PRO) {
  //   ChangeSolution(PartnerSolutionType.MARKET_PRO)
  // }
  // }
  return <>{children}</>
}

export default Provider
