import { SelectField } from '@/components/custom/SelectField'
import { AvatarProfile } from '@/components/tools/AvatarProfile'
import { FormField } from '@/components/ui/form'
import HeaderLine from '@/components/utils/HeaderLine'
import { capitalize, convertImage } from '@/utils/utils'
import { ImagePlus } from 'lucide-react'
import { type } from 'os'
import React from 'react'
import MultiImageField from '../../components/MultiImageField'
import InfoDeal from './InfoDeal'
import QuantityInput from './QuantityInput'
import { useFormContext, UseFormReturn } from 'react-hook-form'
import {
  DealProSchema,
  StepOneDealProSchema,
} from '@/schemas/pro-market/offers-schema'
import { z } from 'zod'

interface StepOneProps {
  form: UseFormReturn<z.infer<typeof DealProSchema>>
}

const StepOne: React.FC<StepOneProps> = ({ form }) => {
  const { control, watch, getValues } = form
  const productImages = watch('productImages')
  const typeProduct = watch('typeProduct')
  const id = watch('id')
  console.log('type :', typeProduct)
  return (
    <>
      <div className='container-item'>
        <SelectField
          control={control}
          name='typeProduct'
          label='Type du deal pro'
          options={['product', 'lots'].map((item) => ({
            key: item,
            label: capitalize(item),
          }))}
        />
      </div>
      {typeProduct == 'lots' ? (
        <>
          <MultiImageField
            control={control}
            name='productImages'
            withAdd={id != ''}
          />
        </>
      ) : (
        <>
          <FormField
            name='productImages'
            control={control}
            render={({ field }) => (
              <AvatarProfile
                {...field}
                onChange={(file) => {
                  field.onChange([file])
                }}
                className='h-72 w-full rounded-[12px] bg-white'
                Icon={<ImagePlus size={72} />}
                iUrl={(productImages && convertImage(productImages[0])) || ''}
              />
            )}
          />
        </>
      )}
      <HeaderLine title='Information du Box' />
      <InfoDeal form={form} disabled={false} />
      <QuantityInput form={form} disabled={false} />
    </>
  )
}

export default StepOne
