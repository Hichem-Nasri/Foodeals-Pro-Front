import { Button } from '@/components/ui/button'
import { MarketRoutes } from '@/lib/routes'
import { ArrowLeft, ArrowRight, LoaderCircle, Send, X } from 'lucide-react'
import Link from 'next/link'
import { useOffersTranslations } from '@/hooks/useTranslations'

export default function PrevNextSubmitButtonsBoxForm({
  step,
  prevStepHandler,
  nextStepHandler,
  isLoading,
}: {
  step: number
  prevStepHandler: () => void
  nextStepHandler: () => void
  isLoading: boolean
}) {
  const t = useOffersTranslations()
  
  return (
    <div className='sticky bottom-0 mt-auto flex gap-3 rounded-[24px] bg-white p-3 max-lg:rounded-b-none'>
      {step == 0 && (
        <Button
          className='flex flex-1 items-center gap-3 text-sm font-medium'
          variant={'destructive'}
          asChild
        >
          <Link href={MarketRoutes.offres}>
            <span>{t('form.cancel')}</span>
            <X />
          </Link>
        </Button>
      )}
      {step > 0 && (
        <Button
          type='button'
          className='flex flex-1 items-center gap-3 text-sm font-medium'
          variant={'destructive'}
          onClick={prevStepHandler}
        >
          <ArrowLeft />
          <span>{t('form.back')}</span>
        </Button>
      )}

      {step < 2 && (
        <Button
          type='button'
          className='flex flex-1 items-center gap-3 text-sm font-medium'
          onClick={nextStepHandler}
        >
          <span>{t('form.next')}</span>
          <ArrowRight />
        </Button>
      )}

      {step === 2 && (
        <Button
          className='flex flex-1 items-center gap-3 text-sm font-medium'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <>
              <span>{t('form.publish')}</span>
              <Send />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
