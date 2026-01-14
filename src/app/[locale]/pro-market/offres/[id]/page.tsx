'use client'
import { CheckboxWithLabelIcon } from '@/components/custom/CheckboxWithLabelIcon'
import { RadioItemWithLabelIcon } from '@/components/custom/RadioItemWithLabelIcon'
import { PriceReductionSlider } from '@/components/tools/PriceReductionSlider'
import { QuantitySelector } from '@/components/tools/QuantitySelector'
import { RadioGroup } from '@/components/ui/radio-group'
import LabelAndRadio from '@/containers/market/components/LabelAndRadio'
import {
  Mail,
  Phone,
  PhoneCall,
  Truck,
  Video,
} from 'lucide-react'
import React from 'react'

export default function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const [aValue, setAValue] =
    React.useState('email')
  const [bValue, setBValue] =
    React.useState('email')
  const [quantity, setQuantity] =
    React.useState(3)
  const [reduction, setReduction] =
    React.useState(30)
  const [
    checkedValues,
    setCheckedValues,
  ] = React.useState(['phone'])
  const [
    checkedCheckbox,
    setCheckedCheckbox,
  ] = React.useState(false)
  return (
    <div className='flex flex-col gap-3 bg-white p-2'>
      {/* <LabelAndRadio
            Icon={Truck}
            checked
            label='something'
            disabled={false}
            value='good'
            onClick={() => {}}
          /> */}
      <RadioGroup>
        <LabelAndRadio
          Icon={Truck}
          checked={false}
          label='something'
          disabled={false}
          value='good'
          onClick={() => {}}
        />
      </RadioGroup>
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        label='Quantity'
        min={0}
        max={10}
      />

      <PriceReductionSlider
        value={reduction}
        onChange={setReduction}
        initialPrice={100}
      />
      {/*  */}
      <RadioGroup
        value={bValue}
        onValueChange={setBValue}
        className='flex flex-col gap-3'
      >
        <RadioItemWithLabelIcon
          value='email'
          label='Email'
          icon={Mail}
          checked={bValue === 'email'}
          color='purple'
        />
        <RadioItemWithLabelIcon
          value='phone'
          label='Phone'
          icon={Phone}
          checked={bValue === 'phone'}
        />
        <RadioItemWithLabelIcon
          value='video'
          label='Video Call'
          icon={Video}
          checked={bValue === 'video'}
          color='yellow'
        />
      </RadioGroup>

      <div className='flex flex-col gap-3'>
        <CheckboxWithLabelIcon
          id='phone'
          label='phone'
          icon={PhoneCall}
          checked={checkedCheckbox}
          onCheckedChange={() =>
            setCheckedCheckbox(
              (prev) => !prev
            )
          }
        />
      </div>
    </div>
  )
}
