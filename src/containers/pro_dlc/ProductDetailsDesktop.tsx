import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { AddProductDlcSchema, DefaultAddProductDlc } from '@/schemas/add-product-form-dlc'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SelectField } from '@/components/custom/SelectField'
import { InputFieldForm } from '@/components/custom/InputField'
import { DatePicker } from '@/components/ui/DatePicker'
import { Calendar } from 'lucide-react'
import React, { FC } from 'react'

interface ProductDetailsDesktopProps {
  drawer: boolean
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductDetailsDesktop: FC<ProductDetailsDesktopProps> = ({ drawer, setDrawer }) => {
  const form = useForm<z.infer<typeof AddProductDlcSchema>>({
    resolver: zodResolver(AddProductDlcSchema),
    defaultValues: {
      ...DefaultAddProductDlc,
      product_id: "1",
      bar_code: "123456789",
      expiryDate: new Date("2024-12-31"),
      quantity: "50"
    },
    mode: 'onSubmit'
  })

  const { control } = form

  const FormContent = () => (
    <Form {...form}>
      <div className="flex w-full flex-col gap-5">
        {/* Grid layout for form fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SelectField
            control={control}
            name="product_id"
            label="Product"
            options={[{ label: "Product Example", key: 1 }]}
            disabled
          />
          <InputFieldForm
            control={control}
            name="bar_code"
            label="Code à barre"
            placeholder="Code à barre"
            disabled
          />
          <div className="[&_.disabled]:text-[#526077]">
            <DatePicker
              control={control}
              name="expiryDate"
              label="Date de péremption"
              icon={Calendar}
              disabled
            />
          </div>
          <InputFieldForm
            control={control}
            name="quantity"
            label="Qté"
            placeholder="x20"
            disabled
          />
        </div>
      </div>
    </Form>
  )

  return (
    <Dialog open={drawer} onOpenChange={setDrawer}>
      <DialogContent className="sm:max-w-[800px] w-full !rounded-2xl p-4 pb-1">
        <div className="flex flex-col gap-5 p-3">
          <h1 className="text-xl font-semibold">Détail de la DLC</h1>
          <FormContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductDetailsDesktop