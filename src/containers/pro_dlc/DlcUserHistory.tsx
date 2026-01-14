// src/containers/pro_dlc/UserHistoryCard.tsx
import React, {
  FC,
  useState,
} from 'react'
import {
  PhoneCall,
  Mail,
  Eye,
  CalendarClock,
  Copy,
  ListPlus,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import ActionButton from '@/components/custom/ActionButton'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AppRoutes,
  DlcRoutes,
} from '@/lib/routes'

interface DlcUserHistory {
  user: {
    avatar: string
    role: string
    name: string
    email: string
    phone: string
  }
  id: string
  date: string
}

interface UserHistoryCardProps {
  history: DlcUserHistory
  rightIcon?: string
  id: string
  toDetails?: boolean
}

const UserHistoryCard: FC<
  UserHistoryCardProps
> = ({
  history,
  rightIcon,
  id,
  toDetails = false,
}) => {
  const [
    showPhoneDialog,
    setShowPhoneDialog,
  ] = useState(false)

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    )
  }

  const handlePhoneClick = () => {
    setShowPhoneDialog(true)
  }

  const handleEmailClick = () => {
    window.location.href = `mailto:${history.user.email}`
  }

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(
        history.user.phone
      )
      setShowPhoneDialog(false)
    } catch (err) {
      console.error(
        'Failed to copy phone number:',
        err
      )
    }
  }
  return (
    <>
      <div className='relative flex h-auto min-w-full max-w-[400px] flex-col gap-3 rounded-[20px] bg-white p-5'>
        <div className='flex h-full w-full'>
          {/* Left side - User content */}
          <div className='flex flex-1 flex-col'>
            <div className='flex items-start justify-start space-x-2 justify-self-start'>
              <Avatar className='h-[46px] w-[46px] border border-lynch-100'>
                <AvatarImage
                  src={
                    history.user.avatar
                  }
                  sizes='46px'
                />
                <AvatarFallback>
                  {history.user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <h1 className='font-montserrat text-[14px] font-normal leading-[17.07px] text-[#343A46]'>
                  {history.user.name}
                </h1>
                <h3 className='font-montserrat text-[12px] font-medium leading-[14.63px] text-[#CA9A04]'>
                  {history.user.role}
                </h3>
                <div className='mt-2 flex items-center space-x-1.5 font-medium text-lynch-500'>
                  <CalendarClock
                    size={18}
                  />
                  <h3 className='text-sm'>
                    {formatDate(
                      history.date
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className='flex flex-wrap items-center gap-4'>
            <ActionButton
              Icon={PhoneCall}
              bgColor='bg-[#FAC215]'
              onClick={handlePhoneClick}
            />
            <ActionButton
              Icon={Mail}
              bgColor='bg-[#A855F7]'
              onClick={handleEmailClick}
            />
            <Link
              href={
                toDetails
                  ? `${AppRoutes.collaboratorDetails.replace(':id', history.id)}`
                  : DlcRoutes.History.replace(
                      ':detail_id',
                      id
                    ).replace(
                      ':history_id',
                      history.id
                    )
              }
            >
              <ActionButton
                Icon={
                  rightIcon === 'eye'
                    ? Eye
                    : ListPlus
                }
                bgColor='bg-[#B1BBC8]'
                onClick={() => {}}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Phone number dialog */}
      <Dialog
        open={showPhoneDialog}
        onOpenChange={
          setShowPhoneDialog
        }
      >
        <DialogContent className='rounded-2xl p-6'>
          <div className='flex flex-col items-center gap-4'>
            <h2 className='font-montserrat text-lg font-semibold text-[#343A46]'>
              Numéro de téléphone
            </h2>
            <div className='flex items-center gap-2'>
              <span className='font-montserrat text-xl'>
                {history.user.phone}
              </span>
              <button
                onClick={
                  handleCopyPhone
                }
                className='rounded-full p-2 transition-colors hover:bg-gray-100'
              >
                <Copy className='h-5 w-5 text-[#343A46]' />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UserHistoryCard
