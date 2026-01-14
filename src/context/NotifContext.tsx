'use client'
import { NotificationType } from '@/types/GlobalType'
import React, {
  createContext,
  useContext,
  useState,
} from 'react'
import { useToast } from '@/hooks/use-toast'
import { NotifDialog } from '@/components/utils/NotifDialog'
import {
  IoBagCheck,
  IoBagRemove,
} from 'react-icons/io5'
import { FiInfo } from 'react-icons/fi'
import { useSolutions } from '@/context/SolutionContext'
import {
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react'

interface Notification {
  type: NotificationType
  message: string
  showAs: 'notif' | 'dialog'
  description: string | null
}

interface NotificationContextType {
  notify: (
    type: NotificationType,
    message: string,
    showAs?: 'notif' | 'dialog',
    description?: string | null
  ) => void
  notifications: Notification[]
}

const NotificationContext =
  createContext<
    NotificationContextType | undefined
  >(undefined)

export const NotificationProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([])
  const { toast } = useToast()
  const { solution } = useSolutions()

  const notify = (
    type: NotificationType,
    message: string,
    showAs:
      | 'dialog'
      | 'notif' = 'notif',
    description: string | null = null
  ) => {
    const newNotification = {
      type,
      message,
      showAs,
      description,
    }
    setNotifications((prev) => [
      ...prev,
      newNotification,
    ])

    if (showAs === 'notif') {
      toast({
        title: message,
        description: description,
        duration: 5000,
        variant:
          type ===
          NotificationType.SUCCESS
            ? 'success'
            : type ===
                NotificationType.ERROR
              ? 'error'
              : 'info',
        action: (
          <div className='animate-pulse rounded-full'>
            {type ===
              NotificationType.SUCCESS && (
              <CheckCircle className='size-6' />
            )}
            {type ===
              NotificationType.ERROR && (
              <XCircle className='size-6' />
            )}
            {type ===
              NotificationType.INFO && (
              <Info className='size-6' />
            )}
          </div>
        ),
      })
    }

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter(
          (notif) =>
            notif !== newNotification
        )
      )
    }, 6000)
  }

  return (
    <NotificationContext.Provider
      value={{ notify, notifications }}
    >
      {children}
      {notifications.map(
        (notif, index) =>
          notif.showAs === 'dialog' && (
            <NotifDialog
              key={index}
              content={notif.message}
              Icon={
                notif.type ===
                NotificationType.SUCCESS
                  ? IoBagCheck
                  : notif.type ===
                      NotificationType.ERROR
                    ? IoBagRemove
                    : FiInfo
              }
              classNameIcon={
                notif.type ===
                NotificationType.SUCCESS
                  ? solution?.colors
                      .text
                  : notif.type ===
                      NotificationType.ERROR
                    ? 'text-coral-500'
                    : 'text-lynch-500'
              }
              isOpen={true}
              setOpen={() => {
                setNotifications(
                  (prev) =>
                    prev.filter(
                      (_, i) =>
                        i !== index
                    )
                )
              }}
            />
          )
      )}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(
    NotificationContext
  )
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}
