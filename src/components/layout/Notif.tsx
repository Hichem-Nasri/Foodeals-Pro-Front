/**
 * The `Notif` function is a React component that displays notifications with different types (success,
 * error, info) and allows users to close them manually or automatically after a certain time period.
 * @param {NotificationProps}  - The code you provided is a React component called `Notif` that
 * displays a notification message with different styles based on the `type` prop passed to it. The
 * notification message will automatically disappear after 5 seconds.
 * @returns The `Notif` component is being returned. It is a functional component that displays a
 * notification message with a specific type (success, error, or info) and allows the user to close the
 * notification.
 */

import {
  useState,
  useEffect,
  Fragment,
} from 'react'
import {
  CheckCircle,
  XCircle,
  X,
  Info,
} from 'lucide-react'
import { NotificationType } from '@/types/GlobalType'
import { NotifDialog } from '../utils/NotifDialog'
import {
  IoBagCheck,
  IoBagRemove,
} from 'react-icons/io5'
import { FiInfo } from 'react-icons/fi'
import { useSolutions } from '@/context/SolutionContext'
import { useToast } from '@/hooks/use-toast'

interface NotificationProps {
  type: NotificationType
  message: string
  showAs: 'notif' | 'dialog'
}

function Notif({
  type,
  message,
  showAs,
}: NotificationProps) {
  const [show, setShow] = useState(true)
  const { solution } = useSolutions()
  const { toast } = useToast()

  useEffect(() => {
    if (showAs === 'notif') {
      toast({
        description: null,
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
          <div className='flex items-center justify-start space-x-2'>
            <div className='rounded-full'>
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
          </div>
        ),
      })
    }
  }, [type, message, showAs, toast])

  if (!message) return null

  const handleClose = () => {
    setShow(false)
  }

  return (
    <Fragment key={'notif'}>
      {showAs === 'notif' ? null : (
        <NotifDialog
          content={message}
          Icon={
            type ===
            NotificationType.SUCCESS
              ? IoBagCheck
              : type ===
                  NotificationType.ERROR
                ? IoBagRemove
                : FiInfo
          }
          classNameIcon={
            type ===
            NotificationType.SUCCESS
              ? solution?.colors.text
              : type ===
                  NotificationType.ERROR
                ? 'text-coral-500'
                : 'text-lynch-500'
          }
          isOpen={show}
          setOpen={setShow}
        />
      )}
    </Fragment>
  )
}

export default Notif
