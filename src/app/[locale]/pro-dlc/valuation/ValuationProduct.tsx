'use client'
import { Salad, X } from 'lucide-react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Fragment, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { CustomButton } from '@/components/custom/CustomButton'
import DLCProduct from '@/types/DlcProduct'
import { PartnerSolutionType } from '@/types/GlobalType'
import Image from 'next/image'
import { GroupedProducts, ValuationForm } from '.'
import { useValuationTranslations, useCommonTranslations } from '@/hooks/useTranslations'

const ValuationToSolution: { [key: string]: PartnerSolutionType } = {
  ['proDlc']: PartnerSolutionType.DLC_PRO,
  ['proMarket']: PartnerSolutionType.MARKET_PRO,
  ['proDonate']: PartnerSolutionType.DONATE_PRO,
}
export default function ValuationProduct({
  product,
  title,
  description,
  children,
  actionFn = () => {},
  disabled = false,
  forms,
}: {
  product: GroupedProducts
  title?: string
  description?: string
  children: React.ReactNode
  actionFn?: () => void
  disabled?: boolean
  forms: Record<string, ValuationForm>
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery({ minWidth: 1024 })
  const t = useValuationTranslations()
  const tCommon = useCommonTranslations()
  
  const dialogTitle = title || t('confirm.title')

  const ListProduct = () => {
    return (
      <div className='flex w-full flex-col gap-3 divide-y-2'>
        {Object.entries(product).map(([key, group]) => (
          <Fragment key={key}>
            {group.products.map((item: DLCProduct) => (
              <div className='flex w-full flex-col gap-3 divide-y-2'>
                {Object?.entries(forms[key] || [])
                  .filter(
                    ([key, value]) =>
                      value !== null && value !== 0 && key != 'reduction'
                  ) // Filter out null and 0 values
                  .map(([key, value]) => (
                    <div className='flex w-full items-center justify-between gap-3 p-2'>
                      <AvatarAndRole
                        classNameAvatar='size-[46px]'
                        avatar={item.imageUrl || ''}
                        role={item.category.name}
                        classNameRole='text-tulip-600'
                        classNameName='flex-1 text-base'
                        name={item.name}
                      />
                      <div className='flex flex-col items-end justify-end gap-2'>
                        <PartnerSolution solution={ValuationToSolution[key]} />
                        <div className='flex justify-end gap-1.5'>
                          <span className='font-montserrat pr-2 text-sm font-semibold leading-[14.63px] text-lynch-500'>
                            x {value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    )
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className='flex min-w-[800px] flex-col gap-5 rounded-[30px] p-[20px] sm:rounded-[30px]'
          showContent={false}
        >
          <DialogTitle className='flex w-full items-center justify-between'>
            <span className='text-2xl text-lynch-400'>{dialogTitle}</span>
            <DialogClose className='text-lynch-400'>
              <X size={24} />
            </DialogClose>
          </DialogTitle>
          <DialogDescription className='h-[50vh] max-h-[80vh] overflow-y-auto'>
            <ListProduct />
          </DialogDescription>
          <DialogFooter className='p-0'>
            <div className='flex w-full items-center justify-end gap-2.5'>
              <DialogClose asChild>
                <CustomButton
                  size={'sm'}
                  label={tCommon('cancel')}
                  IconRight={X}
                  variant='outline'
                  className=''
                />
              </DialogClose>

              <CustomButton
                size={'sm'}
                label={t('confirm.confirm')}
                IconRight={Salad}
                className='border-2 border-white bg-tulip-400 text-white hover:border-tulip-400 hover:bg-tulip-100 hover:text-tulip-400'
                onClick={actionFn}
                disabled={disabled}
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='flex flex-col gap-5 rounded-t-[30px] p-4 pt-0 sm:rounded-t-[30px]'>
        <DrawerTitle className='flex flex-col items-center justify-center gap-3'>
          <span className='text-xl font-medium text-lynch-900'>{dialogTitle}</span>
          <Image
            src='/icons/tag-check-outline.svg'
            alt='tag-check'
            width={80}
            height={80}
          />
        </DrawerTitle>
        <DrawerDescription className='h-[50vh] max-h-[80vh] overflow-y-auto'>
          <ListProduct />
        </DrawerDescription>
        <div className='flex items-center gap-2.5'>
          <DrawerClose asChild className='w-full'>
            <CustomButton
              label={tCommon('cancel')}
              IconRight={X}
              variant='outline'
              className='w-full'
            />
          </DrawerClose>
          <CustomButton
            label={t('confirm.confirm')}
            IconRight={Salad}
            className='w-full border-2 border-white bg-tulip-400 text-white hover:border-tulip-400 hover:bg-tulip-100 hover:text-tulip-400'
            onClick={actionFn}
            disabled={disabled}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
