import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import { PhoneBadge } from '@/components/utils/PhoneBadge'
import { capitalize } from '@/utils/utils'
import React from 'react'

type UserCardRole =
  | string
  | {
      id?: string
      name?: string
      authorities?: string[]
    }

interface UserCardProps {
  user: {
    name: {
      firstName: string
      lastName: string
    }
    avatarPath: string
    role: UserCardRole
    phone: string
  }
  withPhone?: boolean
  onClick?: () => void
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  withPhone = true,
  onClick,
}) => {
  const roleLabel =
    typeof user.role === 'string'
      ? user.role
      : user.role?.name || ''

  return (
    <button
      type='button'
      onClick={onClick}
      className='flex w-full items-center justify-between rounded-[18px] bg-white p-3'
    >
      <AvatarAndRole
        avatar={user.avatarPath}
        name={capitalize(user.name)}
        className='flex items-center gap-2'
        role={capitalize(roleLabel)}
        classNameAvatar='size-[46px]'
      />
      {withPhone && <PhoneBadge phone={user.phone} />}
    </button>
  )
}

export default UserCard
