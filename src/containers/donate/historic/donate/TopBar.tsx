import React, { FC, useState } from 'react'
import { Archive, Box } from 'lucide-react'
import { CustomButton } from '@/components/custom/CustomButton'
import CommandesHeader from '@/components/utils/CommandesHeader'
import SideButton from '@/containers/donate/components/SideBar'
import { FilterDonate } from '../../home/FilterDonate'
import { useDonateTranslations, useCommonTranslations } from '@/hooks/useTranslations'

interface TopBarSupport {
  form: any
  onSubmit: any
  router: any
  state: 'pending' | 'valid' | 'cancel'
  setState: (newStatus: 'pending' | 'valid' | 'cancel') => void
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
  const donateT = useDonateTranslations()
  const commonT = useCommonTranslations()
  const [sheet, setSheet] = useState(false)
  return (
    <div className='top-0 z-50 flex w-full justify-between rounded-[18px] px-2 lg:sticky lg:bg-white lg:shadow lg:shadow-black/10'>
      <div className='w-full gap-3 flex-col-center lg:hidden'>
        <div className='flex w-full items-center justify-between space-x-4 lg:space-x-0'>
          <CommandesHeader
            title={donateT('history.donationHistory')}
            orders={orders}
            color='blue'
          />
          <div className='flex items-center justify-end gap-3'>
            <CustomButton
              label=''
              IconLeft={!archive ? Archive : Box}
              size={'sm'}
              variant='ghost'
              onClick={() => {}}
              className='size-14 rounded-full bg-white text-lynch-400 [&>.icon]:m-0'
            />
            <FilterDonate
              open={open}
              setOpen={setOpen}
              form={form}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
      <div className='hidden items-center justify-start gap-3 p-2 lg:flex'>
        <FilterDonate
          open={open}
          setOpen={setOpen}
          form={form}
          onSubmit={onSubmit}
        />
        <CustomButton
          size='sm'
          variant='outline'
          className={``}
          label={!archive ? donateT('history.archiver') : donateT('history.commands')}
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
      {/* <CustomButton
          label='Scanner'
          size='sm'
          IconRight={QrCode}
          onClick={() => setImage(true)}
        /> */}
    </div>
  )
}

export default TopBar
