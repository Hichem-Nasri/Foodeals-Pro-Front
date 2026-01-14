'use client'
import Notif from '@/components/layout/Notif'
import { NotificationType } from '@/types/GlobalType'
import React, { createContext, useContext, useState } from 'react'

interface NotificationContextType {
  title: string
  setTitle: (title: string) => void
}

const TitleContext = createContext<NotificationContextType | undefined>(
  undefined
)

export const TitleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [title, setTitle] = useState<string>('')

  const onChangeTitle = (title: string) => {
    setTitle(title)
  }

  return (
    <TitleContext.Provider value={{ setTitle: onChangeTitle, title }}>
      {children}
    </TitleContext.Provider>
  )
}

export const useTitle = () => {
  const context = useContext(TitleContext)
  if (!context) {
    throw new Error('useTitle must be used within a TitleProvider')
  }
  return context
}
