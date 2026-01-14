import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import { PhoneBadge } from '@/components/utils/PhoneBadge'
import { UserDto } from '@/types/GlobalType'
import { capitalize } from '@/utils/utils'
import React from 'react'

interface UserCardProps {
  user: Pick<UserDto, 'name' | 'avatarPath' | 'role' | 'phone'>
  withPhone?: boolean
  onClick?: () => void
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  withPhone = true,
  onClick,
}) => {
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
        role={capitalize(user.role.name)}
        classNameAvatar='size-[46px]'
      />
      {withPhone && <PhoneBadge phone={user.phone} />}
    </button>
  )
}

export default UserCard
