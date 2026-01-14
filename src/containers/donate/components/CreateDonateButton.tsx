'use client'
import React, { useState } from 'react'
import SideButton from './SideBar'
import { cn } from '@/lib/utils'

interface CreateDonateButtonProps {
  forMobile?: boolean
}

const CreateDonateButton: React.FC<CreateDonateButtonProps> = ({
  forMobile = false,
}) => {
  const [sheet, setSheet] = useState(false)
  const [open, setOpen] = useState(false)
  return (
    <div
      className={cn(
        'w-full items-center justify-end rounded-[18px] bg-white p-3 lg:flex',
        {
          hidden: !forMobile,
        }
      )}
    >
      <SideButton
        image={open}
        setImage={setOpen}
        sheet={sheet}
        setSheet={setSheet}
      />
      {/*!TODO: add Sheet and image scanner */}
    </div>
  )
}

export default CreateDonateButton
