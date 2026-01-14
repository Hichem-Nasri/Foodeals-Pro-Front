import { CustomButton } from '@/components/custom/CustomButton'
import { Archive, CircleCheckBig, Pencil, Save } from 'lucide-react'
import React from 'react'
import Archiver from '../../../../components/utils/Archiver'
import { useCollaboratorsTranslations } from '@/hooks/useTranslations'

interface TopBarProps {
  form: any
  onSave: (data: any) => void
  onSubmit: () => void
  edit?: boolean
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
  edit,
  handleArchive,
  handleEdit,
  isLoading,
  disabledFirst,
  disabledSecond,
}) => {
  const tc = useCollaboratorsTranslations()
  
  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-center gap-2 rounded-t-[24px] bg-white px-3 py-2 lg:relative lg:justify-end lg:rounded-[18px]'>
      {!edit ? (
        <>
          <div className='flex w-full lg:hidden'>
            <Archiver
              onSubmit={handleArchive}
              title={tc('form.archiveCollaborator')}
              asChild
              isPending={isLoading}
            />
          </div>
          <CustomButton
            label={tc('modify')}
            size='sm'
            variant='default'
            onClick={handleEdit}
            className='hidden lg:flex'
            IconRight={Pencil}
            disabled={isLoading || disabledFirst}
          />
        </>
      ) : (
        <>
          <CustomButton
            label={tc('save')}
            size='sm'
            variant='outline'
            className='w-full min-w-36 lg:w-fit'
            onClick={form.handleSubmit(onSave)}
            IconRight={Save}
            disabled={isLoading || disabledFirst}
          />
          <CustomButton
            label={tc('confirm')}
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
