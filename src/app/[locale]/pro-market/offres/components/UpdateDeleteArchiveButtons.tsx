import { Button } from '@/components/ui/button'
import DeleteDialogDrawer from './DeleteDialogDrawer'
import { ArchiveRestore, Pen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useOffersTranslations } from '@/hooks/useTranslations'

export default function UpdateDeleteArchiveButtons({
  type,
  deleteActionFn,
  isLoading,
  boxId,
  isHistory = false,
}: {
  type: 'normal' | 'surprise'
  deleteActionFn: () => void
  isLoading: boolean
  boxId: string
  isHistory?: boolean
}) {
  const t = useOffersTranslations()
  
  return (
    <div className='sticky bottom-0 mt-auto flex gap-3 rounded-[24px] bg-white p-3 max-lg:rounded-b-none'>
      {!isHistory && (
        <DeleteDialogDrawer
          title={t('dialogs.delete.title')}
          description={t('dialogs.delete.description')}
          actionFn={deleteActionFn}
          disabled={isLoading}
        >
          <Button
            className='flex flex-1 items-center gap-3 border-coral-500 bg-coral-50 text-sm font-medium uppercase text-coral-500'
            variant={'destructive'}
            disabled={isLoading}
          >
            <span>{t('actions.delete')}</span>
            <Trash2 strokeWidth={1.5} />
          </Button>
        </DeleteDialogDrawer>
      )}
      {isHistory && (
        <Button
          className='flex flex-1 items-center gap-3 text-sm font-medium uppercase'
          variant={'destructive'}
          disabled={isLoading}
        >
          <span>{t('actions.archive')}</span>
          <ArchiveRestore />
        </Button>
      )}
      <Button
        type='button'
        className='flex flex-1 items-center gap-3 text-sm font-medium'
        asChild
      >
        <Link href={`/pro-market/offres/box-${type}/${boxId}/edit`}>
          <span>{t('actions.edit')}</span>
          <Pen />
        </Link>
      </Button>
    </div>
  )
}
