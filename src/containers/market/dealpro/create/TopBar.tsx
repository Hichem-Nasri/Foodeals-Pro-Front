import { CustomButton } from '@/components/custom/CustomButton'
import {
  ShoppingBag,
  ShoppingCart,
  X,
  ArrowLeft,
  Send,
  ArrowRight,
} from 'lucide-react'
import React from 'react'

interface TopBarProps {
  handleBack: () => void
  handleNext: () => void
  dealId: string
  state: string
  disabled?: boolean
  isLoading?: boolean
}

const TopBar: React.FC<TopBarProps> = ({
  handleBack,
  handleNext,
  dealId,
  state,
  disabled = false,
  isLoading,
}) => {
  console.log(`?${dealId}?`)
  return (
    <>
      <CustomButton
        variant='outline'
        label={state == 'info' ? 'ANNULER' : 'RETOUR'}
        size={'sm'}
        className={'w-full rounded-[18px] lg:w-fit'}
        onClick={handleBack}
        disabled={disabled || dealId != ''}
        IconRight={state == 'info' ? X : ArrowLeft}
      />
      <CustomButton
        label={state == 'modalie' ? 'PUBLIER' : 'SUIVANT'}
        className={'w-full rounded-[18px] lg:w-fit'}
        size={'sm'}
        onClick={handleNext}
        disabled={disabled || dealId != ''}
        IconRight={state == 'modalie' ? Send : ArrowRight}
        isPending={isLoading}
      />
    </>
  )
}

export default TopBar
