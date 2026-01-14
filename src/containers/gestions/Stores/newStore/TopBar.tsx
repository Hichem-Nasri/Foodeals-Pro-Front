import { CustomButton } from '@/components/custom/CustomButton'
import { Archive, CircleCheckBig, Pencil, Save } from 'lucide-react'
import React from 'react'
import Archiver from '../../../../components/utils/Archiver'
import { useStoresTranslations } from '@/hooks/useTranslations'

interface TopBarProps {
    form: any
    onSave: (data: any) => void
    onSubmit: () => void
    state?: boolean
    handleArchive: (data: any) => void
    handleEdit: () => void
    isLoading?: boolean
    disabledFirst?: boolean
    disabledSecond?: boolean
}

const TopBar: React.FC<TopBarProps> = ({
    form,
    onSubmit,
    onSave,
    state,
    handleArchive,
    handleEdit,
    isLoading,
    disabledFirst,
    disabledSecond,
}) => {
    const t = useStoresTranslations()
    
    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-center gap-2 rounded-t-[24px] bg-white px-3 py-2 lg:relative lg:justify-end lg:rounded-[18px]'>
            {state ? (
                <>
                    <div className='flex w-full lg:hidden'>
                        <Archiver
                            onSubmit={handleArchive}
                            title={t('form.archiveStore')}
                            asChild
                            isPending={isLoading}
                        />
                    </div>
                    <CustomButton
                        label={t('form.modify')}
                        size='sm'
                        variant='default'
                        onClick={handleEdit}
                        className='hidden lg:flex'
                        IconRight={Pencil}
                        disabled={isLoading}
                    />
                </>
            ) : (
                <>
                    <CustomButton
                        label={t('form.save')}
                        size='sm'
                        variant='outline'
                        className='w-full min-w-36 lg:w-fit'
                        onClick={form.handleSubmit(onSave)}
                        IconRight={Save}
                        disabled={isLoading}
                    />
                    <CustomButton
                        label={t('form.confirm')}
                        size='sm'
                        className='w-full min-w-36 lg:w-fit'
                        onClick={onSubmit}
                        IconRight={CircleCheckBig}
                        disabled={isLoading || disabledSecond}
                    />
                </>
            )}
        </div>
    )
}

export default TopBar
