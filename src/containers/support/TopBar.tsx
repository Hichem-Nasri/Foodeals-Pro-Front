import React, { FC } from 'react'
import { table } from 'console'
import {
    ListTodo,
    ArrowRight,
    MessageCircle,
    MessageCircleMore,
} from 'lucide-react'
import image from 'next/image'
import { AppRoutes } from '@/lib/routes'
import { CustomButton } from '@/components/custom/CustomButton'
import { ColumnVisibilityModal } from '@/components/utils/ColumnVisibilityModal'
import { FilterTableSupport } from './FilterTableSupport'
import { Switch } from '@radix-ui/react-switch'
import Switcher from './Switcher'
import { useSupportTranslations } from '@/hooks/useTranslations'

interface TopBarSupport {
    form: any
    onSubmit: any
    table: any
    router: any
    state: 'READ' | 'UNREAD' | 'ALL'
    setState: React.Dispatch<React.SetStateAction<'READ' | 'UNREAD' | 'ALL'>>
    disabled?: boolean
}

const TopBar: FC<TopBarSupport> = ({
    form,
    table,
    onSubmit,
    router,
    state,
    setState,
    disabled = false,
}) => {
    const [open, setOpen] = React.useState(false)
    const t = useSupportTranslations()
    
    return (
        <div className='flex w-full justify-between rounded-[18px] lg:bg-white'>
            <div className='w-full flex-col-center lg:hidden'>
                <Switcher
                    state={state}
                    setState={setState}
                    disabled={disabled}
                />

                <div className='flex w-full items-center justify-between space-x-4 lg:space-x-0'>
                    <h2 className='text-[1.375rem] font-medium text-lynch-950'>
                        {t('supportList')}
                    </h2>
                    <FilterTableSupport
                        open={open}
                        setOpen={setOpen}
                        form={form}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
            <div className='hidden items-center justify-start gap-3 p-2 lg:flex'>
                <Switcher
                    state={state}
                    setState={setState}
                    disabled={disabled}
                />

                <FilterTableSupport
                    open={open}
                    setOpen={setOpen}
                    form={form}
                    onSubmit={onSubmit}
                />
            </div>
            <div className='hidden gap-3 p-2 px-4 lg:flex'>
                <CustomButton
                    label={t('newSupport')}
                    size='sm'
                    IconRight={MessageCircleMore}
                    onClick={() =>
                        router.push(
                            AppRoutes.supportDetails.replace(':id', 'new')
                        )
                    }
                />
            </div>
        </div>
    )
}

export default TopBar
