import { CustomButton } from '@/components/custom/CustomButton'
import { X, Calendar, CheckCheck } from 'lucide-react'
import React, { FC, useState } from 'react'
import CustomSearch from '@/components/utils/CustomSearch'
import { SelectField } from '@/components/custom/SelectField'
import { InputFieldForm } from '@/components/custom/InputField'
import { DatePicker } from '@/components/ui/DatePicker'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import {
  AddProductDlcSchema,
  DefaultAddProductDlc,
} from '@/schemas/add-product-form-dlc'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DialogClose, DialogTitle } from '@/components/ui/dialog'
import MobileHeaderDlc from '@/components/custom/MobileHeaderDlc'

interface AddProductFormDlcProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddProductFormDlc: FC<AddProductFormDlcProps> = ({ setOpen }) => {
  const form = useForm<z.infer<typeof AddProductDlcSchema>>({
    resolver: zodResolver(AddProductDlcSchema),
    defaultValues: DefaultAddProductDlc,
    mode: 'onSubmit',
  })

  const [search, setSearch] = useState<string>('')
  const { control, handleSubmit, reset } = form

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((data) => {
          // todo : add post request to the backend
          reset(DefaultAddProductDlc)
          setSearch('')
          setOpen(false)
        })}
        className='flex w-full flex-col lg:mt-0 lg:space-y-0'
      >
        <MobileHeaderDlc
          title='Information du produit'
          onClick={() => setOpen(false)}
        />

        {/* Desktop Title */}
        <DialogTitle className='mt-0 hidden items-center justify-between border-b border-[#FAC215] pb-4 text-[1.375rem] font-normal text-lynch-400 lg:flex'>
          <h1>Filtrer par</h1>
          <DialogClose>
            <X size={24} />
          </DialogClose>
        </DialogTitle>

        {/* Mobile Container */}
        <div className='min-h-screen bg-[#F6F7F9] lg:hidden'>
          <div className='mx-auto mt-6 w-[92%] space-y-4 rounded-[24px] bg-white p-[25px_16px_16px_16px]'>
            <CustomSearch setSearch={setSearch} search={search} />
            <SelectField
              control={control}
              name='product_id'
              label='Product'
              options={[]}
            />
            <InputFieldForm
              control={control}
              name='bar_code'
              label='Code à barre'
              placeholder='Code à barre'
            />
            <DatePicker
              control={control}
              name='expiryDate'
              label='Date de péremption'
              icon={Calendar}
            />
            <InputFieldForm
              control={control}
              name='quantity'
              label='Qté'
              placeholder='x20'
            />
          </div>
        </div>

        {/* Desktop Form Elements */}
        <div className='hidden lg:block'>
          {/* Keep existing desktop layout */}
          <CustomSearch setSearch={setSearch} search={search} />
          {/* ... other form fields */}
        </div>

        {/* Mobile Submit Button */}
        <div className='fixed bottom-0 left-0 right-0 lg:hidden'>
          <nav className='flex w-full items-center justify-around rounded-t-[32px] bg-white px-5 py-4 shadow-lg'>
            <CustomButton
              label='CONFIRMER'
              className='h-fit w-full bg-[#FAC215] px-5 py-3 text-white hover:bg-[#FAC215]'
              IconRight={CheckCheck}
              type='submit'
            />
          </nav>
        </div>
      </form>
    </Form>
  )
}

export default AddProductFormDlc
