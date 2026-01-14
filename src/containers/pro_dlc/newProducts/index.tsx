'use client'
import React, { FC, use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormProduct from './FormProduct'
import { CustomButton } from '@/components/custom/CustomButton'
import { Archive, CheckCheck } from 'lucide-react'
import { ProductSchemaType } from '@/types/product-type'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { appApi } from '@/lib/routes'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { error } from 'console'
import TopBar from '@/containers/gestions/Products/TopBar'
import ArchiveProduct from '@/components/utils/Archiver'
import { ProductSchema } from '@/schemas/gestion/product-schema'

interface ProductDetailsProps {
  data: {
    product: any
    isLoading: boolean
    error: any
    refetch: any
  }
  mode: string
}

const ProductDetails: FC<ProductDetailsProps> = ({ data, mode }) => {
  const [product, setProduct] = useState<ProductSchemaType>(() => data.product)
  const [edit, setEdit] = useState(product ? false : true)
  const [readOnly, setReadOnly] = useState(() => !edit && mode != 'edit')
  const Notif = useNotification()

  const { mutate, isPending } = useMutation({
    mutationKey: ['product'],
    mutationFn: async (data: ProductSchemaType) => {
      try {
        // if product exist use put else use post
        const methode = product ? 'patch' : 'post'
        // "name": "Perly-Jaouda-80g",
        // "slug": "Perly-Jaouda",
        // "description": "Perly fromage frais",
        // "title": "Perly-Jaouda-80g",
        // "barcode": "6111035001673",
        // "type": "GLOBAL",
        // "price":null,
        // "productImagePath": null,
        // "categoryId": "346f5387-cffd-4753-ae79-afa016e4f4b9",
        // "subCategoryId": "05123710-d533-4e9f-9264-34c550fb09fc",
        // "brand" :"Jaouda",
        // "rayon": "Rayon 06"
        const { category, subCategory, imageUrl, ...rest } = data
        const newData = JSON.stringify({
          ...rest,
          name: data.title,
          slug: data.title,
          price: null,
          type: 'GLOBAL',
          productImagePath: null,
          categoryId: data.category.id,
          subCategoryId: data.subCategory.id,
        })
        console.log('newData:', newData)
        const blob = new Blob([newData], { type: 'application/json' })
        const formData = new FormData()
        formData.append('product', blob)
        formData.append('productImage', imageUrl)
        console.log('methode:', methode)
        const response = await api[methode](appApi.products, formData).catch(
          (error) => {
            throw new Error(error)
          }
        )
        if (response.status !== 201) {
          throw new Error('error')
        }
        console.log('response:', response)
        return response
      } catch (error) {
        throw new Error("Error ajout d'un produit")
      }
    },
    onSuccess: (data) => {
      console.log('data:', data)
      Notif.notify(NotificationType.SUCCESS, 'Product added successfully')
      setProduct(data?.data as ProductSchemaType)
      setEdit(false)
      setReadOnly(true)
    },
    onError: (error) => {
      Notif.notify(NotificationType.ERROR, 'Error adding product')
    },
  })

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    mode: 'onBlur',
    defaultValues: { ...product },
  })
  const onSubmit = (data: z.infer<typeof ProductSchema>) => {
    console.log('hello from data:')
    console.log('data:', data)
    mutate(data)
  }
  const handleArchive = (data: any) => {
    console.log('data:', data) // handle archive with motif and reason
  }
  console.log('form:', form.formState.errors)
  const { handleSubmit } = form

  return (
    <>
      <div className='flex h-full w-full flex-col gap-4 overflow-auto bg-lynch-50 px-2 lg:bg-transparent'>
        <TopBar
          onSubmit={handleSubmit(onSubmit)}
          edit={edit}
          setEdit={setEdit}
        />
        <FormProduct
          form={form}
          data={{
            product,
            isLoading: data.isLoading,
          }}
          onSubmit={onSubmit}
          disabled={readOnly}
          handleEdit={() => setEdit((prev) => !prev)}
          edit={edit}
          condition={[]}
          setCondition={() => {}}
          onSubmitCondition={() => {}}
          productId={''}
        />
        <div className='flex w-full items-center justify-end rounded-[14px] bg-white px-3 py-2'>
          {/* <ArchiveProduct onSubmit={handleArchive} title='Archive Produit'> */}
          <CustomButton
            label='Archive'
            size='sm'
            variant='default'
            onClick={() => console.log('Archive')}
            className='w-full border border-coral-500 bg-coral-50 text-center text-coral-500 transition-all delay-75 duration-100 hover:bg-coral-500 hover:text-coral-50'
            IconRight={Archive}
            disabled={isPending}
          />
          {/* </ArchiveProduct> */}
        </div>
        <div className='fixed bottom-0 z-40 flex w-full rounded-t-lg bg-white p-3 lg:hidden'>
          {!edit ? (
            // <ArchiveProduct onSubmit={handleArchive} title='Archive Produit'>
            <CustomButton
              label='Archive'
              size='sm'
              variant='default'
              onClick={() => console.log('Archive')}
              className='w-full border border-coral-500 bg-coral-50 text-center text-coral-500 transition-all delay-75 duration-100 hover:bg-coral-500 hover:text-coral-50'
              IconRight={Archive}
              disabled={isPending}
            />
          ) : (
            // </ArchiveProduct> TODO: add archive product
            <CustomButton
              label='CONFIRMER'
              size='default'
              onClick={handleSubmit(onSubmit)}
              className='w-full bg-primary text-white'
              IconRight={CheckCheck}
              disabled={isPending}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetails

// const CreationProduct
