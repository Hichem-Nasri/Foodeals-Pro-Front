import React, { FC } from 'react'
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
import { NewImageProduct } from '@/containers/gestions/Products/newProducts/newImage'
import Switcher from './Switcher'
import CommandesHeader from '../../../components/utils/CommandesHeader'
import { FilterOrders } from './FilterOrder'
import SideButton from '../components/SideButton'
import { useDealProTranslations } from '@/hooks/useTranslations'

interface TopBarSupport {
  form: any
  onSubmit: any
  router: any
  state: 'pending' | 'valid' | 'all'
  setState: React.Dispatch<React.SetStateAction<'pending' | 'valid' | 'all'>>
  disabled?: boolean
  orders: number
  archive?: boolean
  isLoading?: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
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
}) => {
  const [image, setImage] = React.useState(false)
  const [sheet, setSheet] = React.useState(false)
  const t = useDealProTranslations()
  return (
    <div className='top-0 flex w-full justify-between rounded-[18px] p-2 lg:sticky lg:bg-white'>
      <div className='w-full gap-3 flex-col-center lg:hidden'>
        <Switcher state={state} setState={setState} disabled={disabled} />

        <div className='flex w-full items-center justify-between space-x-4 lg:space-x-0'>
          <CommandesHeader orders={orders} title={t('title')} />
          <div className='flex items-center justify-end gap-3'>
            <CustomButton
              label=''
              IconLeft={!archive ? Archive : Box}
              size={'sm'}
              variant='ghost'
              onClick={() => {}}
              className='h-14 w-14 rounded-full bg-white text-lynch-400 [&>.icon]:m-0'
            />
            <FilterOrders
              open={open}
              setOpen={setOpen}
              form={form}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
      <div className='hidden items-center justify-start gap-3 lg:flex'>
        <Switcher state={state} setState={setState} disabled={disabled} />

        <FilterOrders
          open={open}
          setOpen={setOpen}
          form={form}
          onSubmit={onSubmit}
        />
        <CustomButton
          size='sm'
          variant='outline'
          className={``}
          label={!archive ? t('topbar.archive') : t('topbar.orders')}
          IconRight={!archive ? Archive : Box}
          onClick={() => {}}
          disabled={isLoading}
        />
      </div>
      <SideButton
        setImage={setImage}
        setSheet={setSheet}
        image={image}
        sheet={sheet}
      />
    </div>
  )
}

export default TopBar
