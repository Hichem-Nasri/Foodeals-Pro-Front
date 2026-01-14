import React from 'react'
import { SquareCheckBig, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/hooks/useTranslations'

interface SelectionButtonProps {
  isSelectionMode: boolean
  onToggle: () => void
}

export const SelectionButton: React.FC<SelectionButtonProps> = ({
  isSelectionMode,
  onToggle,
}) => {
  const { t } = useTranslations();
  
  return (
    <>
      <Button
        size='sm'
        className={cn(
          'h-14 w-14 rounded-full bg-white p-4 text-lynch-500 hover:bg-transparent hover:text-black lg:hidden',
          {
            'bg-[#FAC215] text-white hover:bg-tulip-400': isSelectionMode,
          }
        )}
        onClick={onToggle}
        title={isSelectionMode ? t('dlc.cancel') : t('dlc.actions.select')}
      >
        {isSelectionMode ? <X size={26} /> : <SquareCheckBig size={26} />}
      </Button>
    </>
  )
}
