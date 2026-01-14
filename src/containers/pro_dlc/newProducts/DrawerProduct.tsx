import { CustomButton } from '@/components/custom/CustomButton'

import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { X, Calendar, CircleCheckBig } from 'lucide-react'
import React, { FC, useState, useEffect } from 'react'
import CustomSearch from '@/components/utils/CustomSearch'
import { SelectField } from '@/components/custom/SelectField'
import { InputFieldForm } from '@/components/custom/InputField'
import { DatePicker } from '@/components/ui/DatePicker'
import { Form } from '@/components/ui/form'
import { useForm, UseFormReturn } from 'react-hook-form'
import {
  AddProductDlcSchema,
  DefaultAddProductDlc,
} from '@/schemas/add-product-form-dlc'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { FilterOrganizations } from '@/components/filters/FilterOrganizations'
import api from '@/utils/api'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { useMediaQuery } from 'react-responsive'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { DialogClose } from '@radix-ui/react-dialog'
import { useTranslations } from '@/hooks/useTranslations'

interface DrawerProductProps {
  drawer: boolean
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>
  onClose?: () => void
  data?: z.infer<typeof AddProductDlcSchema>
  type: 'add' | 'update' | 'view'
  id?: string
}

const DrawerProductDlc: FC<DrawerProductProps> = ({
  drawer,
  setDrawer,
  type,
  onClose,
  data = DefaultAddProductDlc,
  id,
}) => {
  const { t } = useTranslations();
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const form = useForm<z.infer<typeof AddProductDlcSchema>>({
    resolver: zodResolver(AddProductDlcSchema),
    defaultValues: {
      product_id: data.product_id || '',
      bar_code: data.bar_code || '',
      expiryDate: data.expiryDate || null,
      quantity: data.quantity || '',
    },
    mode: 'onChange',
    disabled: type === 'view',
  })
  const { notify } = useNotification()
  const [search, setSearch] = useState<string>('')
  const { control, handleSubmit, reset } = form
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationKey: ['products-dlc'],
    mutationFn: async (data: z.infer<typeof AddProductDlcSchema>) => {
      const formData = {
        productId: data.product_id,
        expiryDate: data.expiryDate?.toISOString().split('T')[0],
        quantity: data.quantity,
      }
      const url = id ? `/dlcs/${id}` : '/dlcs'
      const method = id ? 'put' : 'post'
      const res = await api[method](url, formData)
      if (![200, 201, 202].includes(res.status)) {
        if (res.status === 409) throw new Error(t('messages.error.duplicate'))
        throw new Error(t('messages.error.general'))
      }
      return res.data
    },
    onSuccess: () => {
      const messageKey = type === 'add' ? 'messages.success.created' : 'messages.success.updated';
      notify(NotificationType.SUCCESS, t(messageKey))
      reset(DefaultAddProductDlc)
      queryClient.invalidateQueries({
        queryKey: ['products-dlc'],
      })
      setSearch('')
      setDrawer(false)
    },
    onError: (error) => {
      notify(NotificationType.ERROR, error.message)
      console.error(error)
      reset(DefaultAddProductDlc)
      setSearch('')
      setDrawer(false)
    },
  })

  const onSubmit = (data: z.infer<typeof AddProductDlcSchema>) => {
    mutate(data)
  }

  const [product, setProduct] = useState<MultiSelectOptionsType[]>([])
  useEffect(() => {
    const fetchProduct = async () => {
      const url = search
        ? `/products?search=${encodeURIComponent(search)}`
        : `/products`
      const res = await api.get(url)
      if (res.status !== 200) {
        return
      }
      const { data } = res
      setProduct(
        data?.content.map((item: any) => ({
          label: item.name,
          key: item.id,
          id: item.barcode,
          avatar: 'http://localhost:8080/photos/' + item.imageUrl,
        }))
      )
    }
    fetchProduct()
  }, [search])

  return (
    <>
      {!isMobile ? (
        <Dialog
          open={drawer}
          onOpenChange={(open) => {
            setDrawer(open)
            onClose && onClose()
          }}
        >
          <DialogContent
            className='w-full !rounded-2xl p-4 pb-1 focus-within:outline-none sm:max-w-[800px]'
            showContent={false}
          >
            <div className='flex flex-col gap-5 p-3'>
              <DialogTitle className='flex items-center justify-between text-xl font-semibold'>
                {type === 'add'
                  ? t('dlc.add')
                  : type == 'update'
                    ? t('common.edit')
                    : t('common.view')}
                <DialogClose className='text-lynch-400 hover:scale-95 hover:text-lynch-500'>
                  <X size={24} />
                </DialogClose>
              </DialogTitle>
              <FormContent
                form={form}
                type={type}
                onSubmit={onSubmit}
                setDrawer={setDrawer}
                isPending={isPending}
                product={product}
                setSearch={setSearch}
                search={search}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          open={drawer}
          onOpenChange={(open) => {
            setDrawer(open)
            onClose && onClose()
          }}
        >
          <DrawerContent className='w-full flex-col items-start justify-center gap-5 rounded-t-[24px] p-4'>
            <h1 className='text-xl font-semibold'>
              {type === 'add'
                ? t('dlc.add')
                : type == 'update'
                  ? t('common.edit')
                  : t('common.view')}
            </h1>
            <FormContent
              form={form}
              type={type}
              onSubmit={onSubmit}
              setDrawer={setDrawer}
              isPending={isPending}
              product={product}
              setSearch={setSearch}
              search={search}
            />
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

interface FormContentProps {
  form: UseFormReturn<z.infer<typeof AddProductDlcSchema>>
  type: 'add' | 'update' | 'view'
  onSubmit: (data: z.infer<typeof AddProductDlcSchema>) => void
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>
  isPending: boolean
  product: MultiSelectOptionsType[]
  setSearch: React.Dispatch<React.SetStateAction<string>>
  search: string
}

const FormContent: FC<FormContentProps> = ({
  form,
  type,
  onSubmit,
  setDrawer,
  isPending,
  product,
  setSearch,
  search,
}) => {
  const { t } = useTranslations();
  const { control, handleSubmit } = form
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-5'
      >
        {/* Search takes full width */}
        {type !== 'view' && (
          <div className='w-full'>
            <CustomSearch setSearch={setSearch} search={search} />
          </div>
        )}

        {/* Grid layout for form fields */}
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <SelectField
            onChange={(value) => {
              const prod = product.find((values) => values.key === value)
              form.setValue('bar_code', prod?.id)
            }}
            control={control}
            name='product_id'
            label={t('products.product')}
            options={product}
            search
          onChangeSearch={setSearch}
            placeholder={t('products.selectProduct')}
          />
          <InputFieldForm
            control={control}
            name='bar_code'
            label={t('products.barcode')}
            placeholder={t('products.barcode')}
            disabled
          />
          <DatePicker
            control={control}
            name='expiryDate'
            label={t('dlc.expiryDate')}
            icon={Calendar}
          />
          <InputFieldForm
            control={control}
            name='quantity'
            label={t('products.quantity')}
            placeholder='x00'
          />
        </div>

        {type !== 'view' && (
          <div className='sticky bottom-0 left-0 right-0 z-40 flex h-fit w-full items-center gap-2 rounded-t-[24px] bg-white lg:relative lg:flex-auto lg:justify-end lg:bg-transparent'>
            <CustomButton
              variant='outline'
              label={t('common.cancel').toUpperCase()}
              onClick={() => setDrawer(false)}
              className='h-fit w-full px-5 py-3 lg:w-fit'
              IconRight={X}
              type='button'
              disabled={isPending}
            />
            <CustomButton
              label={t('common.confirm').toUpperCase()}
              className='h-fit w-full border-2 border-white bg-[#FAC215] px-5 py-3 text-white hover:border-2 hover:border-tulip-400 hover:bg-tulip-100 hover:text-tulip-400 lg:w-fit'
              IconRight={CircleCheckBig}
              type='submit'
              disabled={
                isPending || type == 'add'
                  ? !form.formState.isValid
                  : !form.formState.isDirty
              }
              isPending={isPending}
            />
          </div>
        )}
      </form>
    </Form>
  )
}

export default DrawerProductDlc
