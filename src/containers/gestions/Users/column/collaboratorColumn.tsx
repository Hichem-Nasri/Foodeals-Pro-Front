import { ActionsMenu } from '@/components/custom/ActionsMenu'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { EmailBadge } from '@/components/utils/EmailBadge'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { PhoneBadge } from '@/components/utils/PhoneBadge'
import { AppRoutes } from '@/lib/routes'
import { CollaboratorsType } from '@/types/collaborators'
import { ContactType, PartnerInfoDto } from '@/types/GlobalType'
import { capitalize } from '@/utils/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pen, Archive, Store, Users } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const columnCollaboratorTableHelper = createColumnHelper<CollaboratorsType>()

export const columnsCollaboratorsTable = (
    router: AppRouterInstance,
    refetch: () => void,
    partnerId: string,
    tc?: (key: string) => string,
    tcommon?: (key: string) => string
) => [
    columnCollaboratorTableHelper.accessor('name', {
        cell: (info) => {
            const { firstName, lastName } = info.getValue()
            const avatar = info.row.original.avatarPath
            return (
                <AvatarAndName
                    avatar={avatar! || ''}
                    name={`${capitalize(firstName)} ${capitalize(lastName)}`}
                    classNameName='text-nowrap'
                    className='w-full'
                />
            )
        },
        header: tc ? tc('name') : 'Nom',
        footer: (info) => info.column.id,
    }),
    columnCollaboratorTableHelper.accessor('role', {
        cell: (info) => (
            <div className='flex items-center gap-1'>{info.getValue()}</div>
        ),
        header: tc ? tc('role') : 'Rôle',
        footer: (info) => info.column.id,
    }),
    columnCollaboratorTableHelper.accessor('city', {
        cell: (info) => info.getValue(),
        header: tc ? tc('city') : 'Ville',
        footer: (info) => info.column.id,
    }),
    columnCollaboratorTableHelper.accessor('region', {
        cell: (info) => info.getValue(),
        header: tc ? tc('region') : 'Région',
        footer: (info) => info.column.id,
    }),
    columnCollaboratorTableHelper.accessor('email', {
        cell: (info) => <EmailBadge email={info.getValue()} />,
        header: tc ? tc('email') : 'Email',
        footer: (info) => info.column.id,
    }),
    columnCollaboratorTableHelper.accessor('phone', {
        cell: (info) => <PhoneBadge phone={info.getValue()} />,
        header: tc ? tc('phone') : 'Téléphone',
        footer: (info) => info.column.id,
    }),
    columnCollaboratorTableHelper.accessor('solutions', {
        cell: (info) => (
            <div className='flex items-center gap-1'>
                {info.getValue().map((solution, index) => (
                    <PartnerSolution
                        key={index.toString()}
                        solution={solution}
                    />
                ))}
            </div>
        ),
        header: tc ? tc('solutions') : 'Solutions',
        footer: (info) => info.column.id,
    }),
    columnCollaboratorTableHelper.accessor('id', {
        cell: (info) => (
            <ActionsMenu
                id={info.getValue()!}
                menuList={[
                    {
                        label: tcommon ? tcommon('view') : 'Voir',
                        icon: Eye,
                        actions: (id: string) =>
                            router.push(
                                AppRoutes.collaboratorDetails.replace(
                                    ':id',
                                    info.getValue()!
                                )
                            ),
                    },
                    {
                        label: tcommon ? tcommon('edit') : 'Modifier',
                        icon: Pen,
                        actions: (id: string) =>
                            router.push(
                                AppRoutes.collaboratorDetails.replace(
                                    ':id',
                                    info.getValue()!
                                ) + '?mode=edit'
                            ),
                    },
                    {
                        label: tcommon ? tcommon('archive') : 'Archiver',
                        icon: Archive,
                        actions: (id: string) => refetch(),
                        archiveUrl:
                            '/users/delete-collaborator/:id?motif=:motif&reason=:reason',
                    },
                ]}
            />
        ),
        header: tcommon ? tcommon('actions') : 'Actions',
        footer: (info) => info.column.id,
    }),
]

export const demoDataCollaborators: CollaboratorsType[] = [
    {
        nationality: null,
        civility: null,
        id: '1',
        name: {
            firstName: 'John',
            lastName: 'Doe',
        },
        manager: {
            id: '2',
            avatarPath: '',
            name: 'Jane Smith',
        },
        region: 'Region 1',
        city: 'City 1',
        role: 'RH',
        avatarPath: 'https://randomuser.me/api/portraits/men/1.jpg',
        email: 'john.doe@example.com',
        phone: '1234567890',
        solutions: [],
    },
    {
        nationality: null,
        civility: null,
        id: '2',
        name: {
            firstName: 'Alice',
            lastName: 'Johnson',
        },
        manager: {
            id: '3',
            avatarPath: '/path/to/avatar',
            name: 'Bob Brown',
        },
        region: 'Region 2',
        city: 'City 2',
        role: 'MANAGER',
        avatarPath: 'https://randomuser.me/api/portraits/women/2.jpg',
        email: 'alice.johnson@example.com',
        phone: '9876543210',
        solutions: [],
    },
]
