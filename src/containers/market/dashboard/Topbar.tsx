import React, { FC, useState } from 'react'
import { table } from 'console'
import {
  ListTodo,
  ArrowRight,
  MessageCircle,
  MessageCircleMore,
  QrCode,
  Archive,
  Box,
} from 'lucide-react'
import image from 'next/image'
import { AppRoutes } from '@/lib/routes'
import { CustomButton } from '@/components/custom/CustomButton'
import { ColumnVisibilityModal } from '@/components/utils/ColumnVisibilityModal'
import { FilterOrders } from './FilterOrders'
import { Switch } from '@radix-ui/react-switch'
import Switcher from './Switcher'
import CommandesHeader from '../../../components/utils/CommandesHeader'
import { NewImageProduct } from '@/containers/gestions/Products/newProducts/newImage'
import SideButton from '../components/SideButton'
import { useMarketTranslations } from '@/hooks/useTranslations'

interface TopBarSupport {
  form: any
  onSubmit: any
  router: any
  state: 'pending' | 'valid' | 'cancel'
  setState: React.Dispatch<React.SetStateAction<'pending' | 'valid' | 'cancel'>>
  disabled?: boolean
  orders: number
  archive?: boolean
  isLoading?: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setImage: React.Dispatch<React.SetStateAction<boolean>>
  image: boolean
}

const TopBar: FC<TopBarSupport> = ({
  form,
  onSubmit,
  router,
  state,
  setState,
  disabled = false,
  orders,
  archive,
  isLoading,
  setOpen,
  open,
  setImage,
  image,
}) => {
  const [sheet, setSheet] = useState(false)
  const t = useMarketTranslations()
  
  return (
    <>
      <div className='top-0 flex w-full justify-between rtl:flex-row-reverse rounded-[18px] px-2 lg:sticky lg:z-40 lg:bg-white lg:shadow lg:shadow-black/10'>
        <div className='w-full gap-3 flex-col-center lg:hidden'>
          <Switcher state={state} setState={setState} disabled={disabled} />

          <div className='flex w-full items-center justify-between space-x-4 lg:space-x-0'>
            <CommandesHeader orders={orders} />
            <div className='flex items-center justify-end gap-3'>
              <CustomButton
                label=''
                IconLeft={!archive ? Archive : Box}
                size={'sm'}
                variant='ghost'
                onClick={() => {}}
                className='size-14 rounded-full bg-white text-lynch-400 [&>.icon]:m-0'
              />
              <FilterOrders
                open={open}
                setOpen={setOpen}
                form={form}
                onSubmit={onSubmit}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
        <div className='hidden items-center justify-start gap-3 p-2 lg:flex'>
          <Switcher state={state} setState={setState} disabled={disabled} />

          <FilterOrders
            open={open}
            setOpen={setOpen}
            form={form}
            onSubmit={onSubmit}
            disabled={disabled}
          />
          <CustomButton
            size='sm'
            variant='outline'
            className={``}
            label={!archive ? t('dashboard.topbar.archive') : t('dashboard.topbar.orders')}
            IconRight={!archive ? Archive : Box}
            onClick={() => {}}
            disabled={isLoading || disabled}
          />
        </div>
        {/* <CustomButton
          label={t('dashboard.topbar.scan')}
          size='sm'
          IconRight={QrCode}
          onClick={() => setImage(true)}
          /> */}
        <SideButton
          setImage={setImage}
          setSheet={setSheet}
          image={image}
          sheet={sheet}
        />
      </div>
    </>
  )
}

export default TopBar
