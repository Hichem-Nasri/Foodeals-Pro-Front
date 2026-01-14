import MobileHeader from '@/components/custom/MobileHeader'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { UserPlus, X } from 'lucide-react'
import React, { useEffect } from 'react'
import SearchCollaborator from '../../../../components/utils/CustomSearch'
import { MultiSelectField } from '@/components/custom/MultiSelectField'
import { Select } from '@/components/custom/Select'
import Image from 'next/image'
import { capitalize } from '@/utils/utils'
import { CustomButton } from '@/components/custom/CustomButton'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import { getUser } from '@/actions/store'
import { Collaborator, UserDto } from '@/types/GlobalType'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { useStoresTranslations } from '@/hooks/useTranslations'

interface ResponsibleSelectProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleCollaborator: (collaborator: any) => void
}

const ResponsibleSelect: React.FC<ResponsibleSelectProps> = ({
    setOpen,
    open,
    handleCollaborator,
}) => {
    const [search, setSearch] = React.useState('')
    const [selected, setSelected] = React.useState<string>('')
    const [users, setUsers] = React.useState<Collaborator[]>([])
    const t = useStoresTranslations()

    useEffect(() => {
        const fetchUser = async () => {
            const res = await getUser(search, selected)
            if (res.status == 500) {
                return
            }
            console.log('++++++++++', res.data)
            const users = res.data?.content.map((user: UserDto) => ({
                id: user.id + '',
                name: `${capitalize(user.name?.firstName)} ${capitalize(user.name?.lastName)}`.trim(),
                avatar: user.avatarPath || '',
                role: capitalize(user?.role?.name.replace('_', ' ')),
            }))
            setUsers(users)
        }
        fetchUser()
        // fetch users
    }, [search, selected])

    const Reset = () => {
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className='top-0 mb-20 flex h-screen min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-hidden bg-white px-0 py-0 lg:left-[calc(100%-510px)] lg:top-1/2 lg:h-full lg:min-w-[500px] lg:-translate-y-[50%] lg:translate-x-0 lg:gap-4 lg:px-4 lg:py-4'
                showContent={false}
            >
                <DialogTitle className='hidden items-center justify-between text-wrap text-lg font-light text-lynch-500 lg:flex'>
                    <span>{t('form.searchCollaborators')}</span>
                    <button type='button' onClick={Reset}>
                        <X />
                    </button>
                </DialogTitle>
                <MobileHeader
                    title={t('form.collaboratorsTitle')}
                    onClick={Reset}
                    buttonType='dialog'
                />
                <DialogDescription className='flex h-full w-full flex-col items-center justify-start gap-[20px] space-y-2 bg-white px-3 py-5 pb-0'>
                    <div className='flex w-full flex-col items-center justify-start gap-[20px]'>
                        <SearchCollaborator
                            setSearch={setSearch}
                            search={search}
                            placeholder={t('form.collaboratorNamePlaceholder')}
                        />
                        <Select
                            label={t('form.department')}
                            value={selected}
                            placeholder={t('form.selectRolePlaceholder')}
                            onChange={(e) => setSelected(e)}
                            className='w-full min-w-full'
                            options={['MANAGER', 'SALES_MANAGER', 'CLIENT'].map(
                                (val) => ({ key: val, label: capitalize(val) })
                            )}
                        />
                    </div>
                    {users.length > 0 ? (
                        <div className='flex max-h-[50%] w-full flex-col items-start gap-3 overflow-auto'>
                            {users.map((collaborateur, index) => (
                                <>
                                    <button
                                        key={collaborateur.id}
                                        className='flex w-full items-center justify-start gap-3'
                                        onClick={() => {
                                            handleCollaborator(collaborateur)
                                        }}
                                    >
                                        <AvatarAndRole
                                            avatar={collaborateur.avatar}
                                            role={collaborateur.role}
                                            name={collaborateur.name}
                                            classNameName='text-lynch-950 font-normal'
                                            classNameAvatar='border-[1px] border-lynch-300 rounded-full'
                                        />
                                    </button>
                                    {index < users.length - 1 && (
                                        <hr className='h-[0.55px] w-full bg-lynch-300' />
                                    )}
                                </>
                            ))}
                        </div>
                    ) : (
                        <div className='flex h-full flex-col items-center justify-center'>
                            <Image
                                lazyBoundary='200px'
                                src='/images/emptyUser.svg'
                                alt='No user found'
                                width={100}
                                height={100}
                            />
                            <h6 className='text-lg font-semibold text-lynch-950'>
                                {t('form.userNotFound')}
                            </h6>
                            <p className='text-sm font-normal text-primary'>
                                {t('form.createNewUser')}
                            </p>
                        </div>
                    )}
                    <Link
                        href={AppRoutes.collaboratorDetails.replace(
                            ':id',
                            'new'
                        )}
                        className='sticky bottom-0 left-0 right-0 w-full p-1'
                    >
                        <CustomButton
                            label={t('form.createNewUserButton')}
                            IconRight={UserPlus}
                            className='h-14 w-full rounded-[18px]'
                        />
                    </Link>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default ResponsibleSelect
