import {
    ArrowLeft,
    SaveIcon,
    CheckCircle,
    ChevronLeft,
    Pencil,
} from 'lucide-react'

import React, { FC, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'
import { set } from 'date-fns'
import { CustomButton } from '@/components/custom/CustomButton'

interface TopBarProps {
    onSubmit: any
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
    edit?: boolean
}

const TopBar: FC<TopBarProps> = ({ onSubmit, edit, setEdit }) => {
    const router = useRouter()
    const Mobile = useMediaQuery({ query: '(max-width: 1024px)' })
    return (
        <div className='hidden w-full justify-between rounded-[18px] bg-white p-2 lg:flex'>
            <CustomButton
                label='Retour'
                IconLeft={ArrowLeft}
                variant='outline'
                onClick={router.back}
                size='sm'
            />
            {!edit ? (
                <CustomButton
                    label='Modifier'
                    size={'sm'}
                    IconRight={Pencil}
                    onClick={() => setEdit((prev) => !prev)}
                />
            ) : (
                <div className={`flex items-center justify-center space-x-2`}>
                    <CustomButton
                        label='Enregistrer'
                        variant='outline'
                        size='sm'
                        IconRight={SaveIcon}
                        onClick={onSubmit}
                    />
                    <CustomButton
                        label='Confirmer'
                        size='sm'
                        IconRight={CheckCircle}
                        disabled
                    />
                </div>
            )}
        </div>
    )
}

export default TopBar
