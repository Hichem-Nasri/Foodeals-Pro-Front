import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  CircleCheckBig,
  Eraser,
  ListFilter,
  X,
} from 'lucide-react'
import React, { FC } from 'react'

import { CustomButton } from '@/components/custom/CustomButton'
import { InputFieldForm } from '@/components/custom/InputField'
import MobileHeader from '@/components/custom/MobileHeader'
import { DateFilter } from '@/components/filters/DateFilters'
import { FilterManager } from '@/components/filters/FilterManger'
import { FilterOrganizations } from '@/components/filters/FilterOrganizations'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FilterSchemaProduct } from '@/schemas/gestion/product-schema'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import SelectCategory from './newProducts/SelectCategory'
import { useTranslations } from '@/hooks/useTranslations'

interface FilerTableProductsProps {
  form: UseFormReturn<
    z.infer<typeof FilterSchemaProduct>
  >
  onSubmit: (
    data: z.infer<
      typeof FilterSchemaProduct
    >
  ) => void
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  open: boolean
  setFilterData?: React.Dispatch<
    React.SetStateAction<any>
  >
}

export const FilterTableProducts: FC<
  FilerTableProductsProps
> = ({
  form,
  onSubmit,
  setOpen,
  open,
  setFilterData,
}) => {
  const { t } = useTranslations()
  
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='flex h-14 w-14 gap-2 rounded-full border border-lynch-300 bg-transparent bg-white text-lynch-500 hover:bg-neutral-100 hover:bg-transparent hover:text-black disabled:border-lynch-300 disabled:text-lynch-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 lg:h-12 lg:w-fit lg:rounded-[12px] lg:py-1'
        >
          <span className='hidden lg:inline-block'>
            {t('products.filterBy')}
          </span>
          <ListFilter size={26} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-white px-0 py-0 lg:top-1/2 lg:h-auto lg:min-h-fit lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:px-4 lg:py-4'
        showContent={false}
      >
        <FormProduct
          form={form}
          onSubmit={onSubmit}
          setOpen={setOpen}
          setFilterData={setFilterData}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormProductProps {
  form: UseFormReturn<
    z.infer<typeof FilterSchemaProduct>
  >
  onSubmit: (
    data: z.infer<
      typeof FilterSchemaProduct
    >
  ) => void
  setOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setFilterData?: React.Dispatch<
    React.SetStateAction<any>
  >
}

const FormProduct: FC<
  FormProductProps
> = ({
  form,
  onSubmit,
  setOpen,
  setFilterData,
}) => {
  const { t } = useTranslations()
  const { handleSubmit, control } = form
  console.log(
    'values: ',
    form.getValues()
  )
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className='-full flex w-full flex-col gap-2 lg:mt-0 lg:space-y-0'
      >
        <DialogTitle className='mt-0 hidden items-center justify-between text-[1.375rem] font-normal text-lynch-400 lg:flex'>
          <h1>{t('products.filterBy')}</h1>
          <DialogClose>
            <X size={24} />
          </DialogClose>
        </DialogTitle>
        <MobileHeader
          title={t('products.filterBy')}
          onClick={() => setOpen(false)}
        />
        <DialogDescription>
          <div className='flex flex-col gap-5 gap-x-4 px-4 py-5'>
            <DateFilter
              form={form}
              disabled={false}
            />
            <div className='flex w-full flex-col gap-5 lg:flex-row'>
              <FilterOrganizations
                control={control}
                placeholder={t('products.selectProduct')}
                name='name'
                url='/products?pageNum=0&pageSize=10&name=:search'
                label={t('common.products')}
                oneSelect
                fn={(data: any) => {
                  if (!data) return []
                  return data.content.map(
                    (val: any) => ({
                      key: val.name,
                      label: val.name,
                      avatar:
                        val.imageUrl &&
                        val.imageUrl.startsWith(
                          'http'
                        )
                          ? val.imageUrl
                          : 'http://localhost:8080/photos/' +
                            val.imageUrl,
                    })
                  )
                }}
              />
              <FilterOrganizations
                label={t('products.brand')}
                control={control}
                name='brand'
                placeholder={t('products.selectBrand')}
                url='/brands'
                fn={(data: any) => {
                  return data?.content.map(
                    (val: any) => ({
                      key: val.name,
                      label: val.name,
                    })
                  )
                }}
                oneSelect
              />
            </div>
            <div className='flex w-full flex-col gap-5 text-sm lg:flex-row'>
              <FilterOrganizations
                control={control}
                placeholder={t('products.selectBrand')}
                name='organizationId'
                url='/subentities?pageNum=0&pageSize=10'
                label={t('products.partner')}
                withSearch='subentities?pageNum=0&pageSize=10'
                oneSelect
                fn={(data: any) => {
                  if (!data) return []
                  return data.content.map(
                    (val: any) => ({
                      key: val.name,
                      label: val.name,
                      avatar:
                        val.imageUrl &&
                        val.imageUrl.startsWith(
                          'http'
                        )
                          ? val.imageUrl
                          : 'http://localhost:8080/photos/' +
                            val.imageUrl,
                    })
                  )
                }}
              />
              <FilterManager
                control={control}
                name='userId'
                label={t('products.importedBy')}
                type={''}
              />
            </div>
            <div className='flex w-full flex-col gap-5 lg:flex-row'>
              <SelectCategory
                form={form}
                control={control}
                disabled={false}
                name={{
                  category:
                    'categoryId',
                  subCategory:
                    'subCategoryId',
                }}
              />
            </div>
            <div className='flex w-full flex-col gap-5 lg:flex-row'>
              <InputFieldForm
                control={control}
                name='barcode'
                label={t('products.barcode')}
                placeholder={t('products.enterBarcode')}
              />
            </div>
          </div>

          <div className='sticky bottom-0 left-0 right-0 z-40 flex h-fit w-full flex-col items-start space-x-2 rounded-t-[24px] bg-white p-4 lg:relative lg:flex-row lg:justify-end lg:bg-transparent'>
            <CustomButton
              variant='ghost'
              title={t('products.resetFilters')}
              label={t('products.clear')}
              className='h-12 w-fit gap-2 px-2 py-2 text-primary lg:gap-0 lg:rounded-full [&>.icon]:mr-0 lg:[&>.label]:hidden'
              IconLeft={Eraser}
              onClick={() => {
                form.setValue(
                  'name',
                  ''
                )
                form.setValue(
                  'brand',
                  ''
                )
                form.setValue(
                  'organizationId',
                  ''
                )
                form.setValue(
                  'userId',
                  ''
                )
                form.setValue(
                  'categoryId',
                  ''
                )
                form.setValue(
                  'subCategoryId',
                  ''
                )
                form.setValue(
                  'barcode',
                  ''
                )
                form.setValue(
                  'startDate',
                  undefined
                )
                form.setValue(
                  'endDate',
                  undefined
                )
              }}
              type='reset'
            />
            <div className='w-full gap-2 flex-center-end lg:w-fit'>
              <CustomButton
                variant='outline'
                label={t('products.cancel')}
                onClick={() => {
                  setOpen(false)
                }}
                className='h-fit w-full px-5 py-3 lg:w-fit'
                IconRight={X}
                type='submit'
              />
              <CustomButton
                label={t('products.confirm')}
                onClick={() => {}}
                className='h-fit w-full px-5 py-3 lg:w-fit'
                IconRight={
                  CircleCheckBig
                }
                type='submit'
              />
            </div>
          </div>
        </DialogDescription>
      </form>
    </Form>
  )
}
