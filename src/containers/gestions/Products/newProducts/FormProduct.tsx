'use client'
import { AvatarField } from '@/components/custom/AvatarField'
import { InputFieldForm } from '@/components/custom/InputField'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import React, { FC, useState } from 'react'
import { Form } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { PencilLine, X } from 'lucide-react'
import { ProductSchema } from '@/schemas/gestion/product-schema'
import { ProductSchemaType } from '@/types/product-type'
import { SelectField } from '@/components/custom/SelectField'
import ConditionProducts, {
  defaultConditionProductDemo,
} from './ConditionProduct'
import { Label } from '@/components/custom/Label'
import { Textarea } from '@/components/ui/textarea'
import { CustomButton } from '@/components/custom/CustomButton'
import SelectCategory from './SelectCategory'
import ProductStatus from '../../settings/ProductStatus'
import { ConditionProduct } from '../../settings'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/lib/routes'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface FormProductProps {
  form: UseFormReturn<z.infer<typeof ProductSchema>>
  data: {
    product: any
    isLoading: boolean
  }
  onSubmit: (data: z.infer<typeof ProductSchema>) => void
  disabled?: boolean
  handleEdit: () => void
  edit: boolean
  condition: ConditionProduct[]
  setCondition: React.Dispatch<React.SetStateAction<ConditionProduct[]>>
  onSubmitCondition: (data: any) => void
  productId: string
}

const FormProduct: FC<FormProductProps> = ({
  form,
  data,
  onSubmit,
  disabled = false,
  handleEdit,
  edit,
  condition,
  setCondition,
  onSubmitCondition,
  productId,
}) => {
  const route = useRouter()
  return (
    <>
      <div className='hidden w-full flex-col gap-4 lg:flex'>
        <Accordion
          type='single'
          collapsible
          className='w-full rounded-[14px] bg-white px-4 py-6 lg:p-5'
          defaultValue='Product'
        >
          <AccordionItem
            value='Product'
            className='text-[1.375rem] font-normal text-lynch-400'
          >
            <AccordionTrigger className='py-0 text-[1.375rem] font-normal'>
              Information du produit
            </AccordionTrigger>
            <AccordionContent className='pt-7'>
              <NewFormProduct
                form={form}
                onSubmit={onSubmit}
                isLoaded={data.isLoading}
                disabled={disabled}
                product={data.product}
                edit={edit}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion
          type='single'
          collapsible
          className='w-full rounded-[14px] bg-white px-4 py-6 lg:p-5'
          defaultValue='Product'
        >
          <AccordionItem
            value='Product'
            className='text-[1.375rem] font-normal text-lynch-400'
          >
            <AccordionTrigger className='py-0 text-[1.375rem] font-normal'>
              Conditions du produit
            </AccordionTrigger>
            <AccordionContent className='pt-7 flex-col-center'>
              {
                <Link
                  href={AppRoutes.settings + `?product=${productId}`}
                  className='self-end'
                >
                  <CustomButton
                    label=''
                    size='sm'
                    className='flex h-[42px] w-[42px] items-center justify-center rounded-full bg-primary text-white [&>.icon]:ml-0'
                    IconRight={PencilLine}
                  />
                </Link>
              }
              <ProductStatus
                setCondition={setCondition}
                condition={condition}
                onSubmit={onSubmitCondition}
                disabled={true}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className='flex min-w-full flex-col items-start justify-center gap-4 lg:hidden'>
        <NewFormProduct
          form={form}
          onSubmit={onSubmit}
          isLoaded={data.isLoading}
          disabled={disabled}
          edit={edit}
          product={data.product}
          handleEdit={handleEdit}
        />
        {data.product && (
          <ConditionProducts id={data.product.id} product={data.product} />
        )}
      </div>
    </>
  )
}

interface NewFormProduct {
  form: UseFormReturn<z.infer<typeof ProductSchema>>
  onSubmit: (data: z.infer<typeof ProductSchema>) => void
  isLoaded: boolean
  disabled?: boolean
  edit: boolean
  product: ProductSchemaType
  handleEdit?: () => void
}

export const NewFormProduct: FC<NewFormProduct> = ({
  form,
  onSubmit,
  isLoaded,
  disabled = false,
  edit,
  handleEdit,
  product,
}) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col items-center justify-center gap-[1.875rem]'
      >
        <div
          className={`flex w-full items-center gap-5 lg:justify-center lg:pb-0 ${
            product ? 'justify-between' : 'justify-center'
          }`}
        >
          <div className='flex items-center space-x-2 lg:justify-center'>
            <AvatarField
              name='imageUrl'
              form={form}
              alt={'upload image'}
              label='Photo de produit'
              className='flex size-[130px] items-center justify-center !rounded-full bg-white lg:bg-transparent'
              classNameAvatar='!rounded-full size-[130px] lg:bg-transparent bg-white'
              isLoaded={isLoaded}
              disabled={disabled}
            />
            {/* TODO: ask about uploading images  */}
            {product && (
              <div className='flex flex-col items-start justify-center space-y-3 text-wrap lg:hidden'>
                <h1 className='text-xl font-normal text-lynch-950'>
                  {product.name}
                </h1>
                <h3 className='text-base font-normal text-primary'>
                  {product.category.name}
                </h3>
              </div>
            )}
          </div>
          {product && (
            <>
              <CustomButton
                disabled={disabled}
                type='button'
                label=''
                size='sm'
                variant='ghost'
                onClick={() => handleEdit && handleEdit()}
                className='size-11 rounded-full bg-white text-lynch-400 hover:bg-white hover:text-lynch-400 lg:hidden [&>.icon]:mr-0'
                IconLeft={!edit ? PencilLine : X}
              />
            </>
          )}
        </div>
        <div className='flex w-full items-center justify-start gap-x-2 py-4 text-[1.375rem] font-normal lg:hidden lg:justify-between'>
          <Separator className='flex-1 bg-lynch-100 lg:hidden' />
          <h1 className='flex-1 self-start text-nowrap text-lynch-400 lg:flex-initial'>
            Information du produit
          </h1>
          <Separator className='flex-1 bg-lynch-100 lg:hidden' />
        </div>
        <div className='flex h-full w-full flex-col gap-6 rounded-[30px] bg-white px-4 py-[25px] lg:rounded-none lg:bg-transparent'>
          <div className='flex w-full flex-col items-start gap-3 lg:flex-row'>
            <InputFieldForm
              control={form.control}
              placeholder={'Saisir le titre'}
              name={'title'}
              label='Titre'
              isLoaded={isLoaded}
              disabled={disabled}
              className='text-lynch-500'
            />
            <InputFieldForm
              control={form.control}
              placeholder={'Saisir la marque'}
              name={'brand'}
              label='Marque'
              isLoaded={isLoaded}
              disabled={disabled}
              className='text-lynch-500'
            />
            <InputFieldForm
              control={form.control}
              placeholder={'Saisir la description'}
              name={'description'}
              label='Description'
              isLoaded={isLoaded}
              disabled={disabled}
              className='text-lynch-500'
            />
          </div>
          <div className='flex w-full flex-col items-start gap-3 lg:flex-row'>
            <InputFieldForm
              control={form.control}
              placeholder={'Saisir le code bar'}
              name={'barcode'}
              label='Code Bar'
              isLoaded={isLoaded}
              disabled={disabled}
              className='text-lynch-500'
            />
            <SelectCategory
              form={form}
              control={form.control}
              disabled={disabled}
            />
          </div>
          <div className='grid w-full grid-cols-1 flex-col items-start gap-3 lg:grid-cols-3 lg:flex-row'>
            <InputFieldForm
              control={form.control}
              placeholder={'Unité'}
              name={'type'}
              label='Type d’unité (s)'
              disabled={disabled}
              className='text-lynch-500'
              classNameParent='col-span-1'
            />
            <InputFieldForm
              control={form.control}
              placeholder={'Nom du rayon'}
              name={'rayon'}
              label='Rayon'
              isLoaded={isLoaded}
              disabled={disabled}
              className='text-lynch-500'
              classNameParent='col-span-1'
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default FormProduct
