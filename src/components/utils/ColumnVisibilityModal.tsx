import { FC } from 'react'
import { Columns2, X } from 'lucide-react'
import { Switch } from '../custom/Switch'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { cn } from '@/lib/utils'
import { CustomButton } from '../custom/CustomButton'
import { useTranslations } from '@/hooks/useTranslations'

interface ColumnVisibilityModalProps {
    table: import('@tanstack/table-core').Table<any>
    className?: string
    hiddens?: string[]
}

export const ColumnVisibilityModal: FC<ColumnVisibilityModalProps> = ({
    table,
    className,
    hiddens,
}) => {
    const { t } = useTranslations()
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <CustomButton
                    label={t('fields.showColumns')}
                    size={'sm'}
                    variant='outline'
                    IconRight={Columns2}
                    className={cn(className)}
                />
            </DialogTrigger>
            <DialogContent className='w-full max-w-[42.5rem] gap-[1.875rem] rounded-[14px] p-5 [&>.Icon]:hidden'>
                <DialogTitle className='flex items-center justify-between gap-3 text-[1.375rem] font-normal text-lynch-400'>
                    {t('fields.displayColumns')}
                    <DialogClose>
                        <X />
                    </DialogClose>
                </DialogTitle>
                <div className='flex flex-wrap gap-3'>
                    {table
                        .getAllColumns()
                        .map(
                            (column) =>
                                column.id !== 'id' &&
                                !hiddens?.includes(column.id) && (
                                    <Switch
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onChange={column.getToggleVisibilityHandler()}
                                        label={
                                            column.columnDef.header?.toString() ||
                                            ''
                                        }
                                    />
                                )
                        )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
