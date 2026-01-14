import { FC } from 'react'
import {
    Archive,
    CalendarClock,
    Eye,
    Handshake,
    Mail,
    MapPin,
    Pen,
    PhoneCall,
    Users,
} from 'lucide-react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { ActionsMenu, ActionType } from '@/components/custom/ActionsMenu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CustomButton } from '@/components/custom/CustomButton'
import { capitalize } from '@/utils/utils'
import { Label } from '@/components/custom/Label'
import { CollaboratorsType } from '@/types/collaborators'
import { useCollaboratorsTranslations, useCommonTranslations } from '@/hooks/useTranslations'

interface CollaboratorCardProps {
    User?: CollaboratorsType
    partnerId: string
    refetch?: () => void
}

export const CollaboratorCard: FC<CollaboratorCardProps> = ({
    User,
    partnerId,
    refetch,
}) => {
    const router = useRouter()
    const tc = useCollaboratorsTranslations()
    const tcommon = useCommonTranslations()
    
    if (!User) return

    const actions: ActionType[] = [
        {
            actions: (id) =>
                router.push(AppRoutes.collaboratorDetails.replace(':id', id)),
            icon: Eye,
            label: tcommon('view'),
        },
        {
            label: tcommon('edit'),
            icon: Pen,
            actions: (id: string) =>
                router.push(
                    AppRoutes.collaboratorDetails.replace(':id', id!) +
                        '?mode=edit'
                ),
        },
        {
            actions: (id) => {
                refetch && refetch()
            },
            icon: Archive,
            label: tcommon('archive'),
            archiveUrl:
                '/users/delete-collaborator/:id?motif=:motif&reason=:reason',
        },
    ]
    const fullName =
        capitalize(User.name.firstName) + ' ' + capitalize(User.name.lastName)
    return (
        <div className='flex flex-col gap-3 rounded-[20px] bg-white p-3'>
            <div className='flex justify-between gap-[0.375rem]'>
                <div className='flex gap-[0.375rem]'>
                    <Avatar className='size-[2.875rem] shrink-0'>
                        <AvatarImage className='' src={User.avatarPath!} />
                        <AvatarFallback>{fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                        <Label
                            label={fullName}
                            className='text-base font-normal text-lynch-950'
                        />
                        <Label
                            label={User.role}
                            className='text-xs font-medium text-primary'
                        />
                    </div>
                </div>
                <div className='flex flex-col items-end justify-center gap-2'>
                    <div className='flex flex-wrap items-center gap-[0.375rem]'>
                        <Link href={`tel:${User.phone}`}>
                            <CustomButton
                                label=''
                                IconLeft={PhoneCall}
                                className='h-fit shrink-0 rounded-full p-[0.625rem] [&>.icon]:m-0'
                            />
                        </Link>
                        <Link href={`mailto:${User.email}`}>
                            <CustomButton
                                label=''
                                IconLeft={Mail}
                                className='h-fit shrink-0 rounded-full bg-amethyst-500 p-[0.625rem] [&>.icon]:m-0'
                            />
                        </Link>
                        <ActionsMenu
                            id={User.id}
                            menuList={actions}
                            className='p-[0.625rem] [&>svg]:size-6'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
