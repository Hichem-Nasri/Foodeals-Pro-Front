'use client'
import React, { FC, use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FormProduct from './FormProduct'
import { CustomButton } from '@/components/custom/CustomButton'
import { Archive, CheckCheck } from 'lucide-react'
import TopBar from '../TopBar'
import { ProductSchemaType } from '@/types/product-type'
import { ProductSchema } from '@/schemas/gestion/product-schema'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { appApi } from '@/lib/routes'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import Archiver from '../../../../components/utils/Archiver'
import { useRouter } from 'next/navigation'
import { defaultConditionProductDemo } from './ConditionProduct'
import { ConditionProduct, useCondtionProduct } from '../../settings'
import { useMediaQuery } from 'react-responsive'

interface ProductDetailsProps {
  data: {
    product: any
    isLoading: boolean
    error: any
    refetch: any
  }
  mode: string
  id: string
}

const ProductDetails: FC<ProductDetailsProps> = ({ data, mode, id }) => {
  const [product, setProduct] = useState<ProductSchemaType>(() => data.product)
  const [edit, setEdit] = useState(product ? false : true)
  const [productId, setProductId] = useState(id)
  const [readOnly, setReadOnly] = useState(() => !edit && mode != 'edit')
  const [condition, setCondition] = useState<ConditionProduct[]>(
    data.product?.pickupConditions?.length > 0
      ? data.product.pickupConditions
      : defaultConditionProductDemo
  )
  const onSubmitCondition = (data: any) => {}
  const notif = useNotification()
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationKey: ['product'],
    mutationFn: async (data: ProductSchemaType) => {
      try {
        const methode = product ? 'patch' : 'post'
        const {
          category,
          subCategory,
          imageUrl,
          paymentMethodResponse,
          deliveryMethodResponse,
          ...rest
        } = data
        const newData = JSON.stringify({
          ...rest,
          name: data.title,
          slug: data.title,
          price: null,
          type: 'GLOBAL',
          productImagePath: null,
          categoryId: data.category.id,
          subCategoryId:
            data.subCategory.id == 'none' ? '' : data.subCategory.id,
        })

        const blob = new Blob([newData], { type: 'application/json' })
        const formData = new FormData()
        formData.append('product', blob)
        formData.append('productImage', imageUrl)

        const response = await api[methode](
          appApi.products + (product ? `/${productId}` : ''),
          formData
        ).catch((error) => {
          throw new Error(error)
        })
        if (![200, 201, 203].includes(response.status)) {
          throw new Error('error')
        }

        return response
      } catch (error) {
        throw new Error("Error ajout d'un produit")
      }
    },
    onSuccess: (data) => {
      if (data.data?.id) {
        setProductId(data.data.id)
      }
      notif.notify(NotificationType.SUCCESS, 'Produit ajouté avec succès')
      setProduct(data?.data as ProductSchemaType)
      setEdit(false)
      setReadOnly(true)
    },
    onError: (error) => {
      notif.notify(NotificationType.ERROR, 'Erreur ajout produit')
    },
  })

  const { mutate: mutateCondition, isPending: isPendingCondition } =
    useMutation({
      mutationKey: ['condition-retrait'],
      mutationFn: useCondtionProduct,
      onSuccess: (data: any) => {
        notif.notify(
          NotificationType.SUCCESS,
          'les conditions retrait bien change'
        )
      },
      onError: (error) => {
        notif.notify(
          NotificationType.ERROR,
          'Error change le condition retrait'
        )
      },
    })

  const { mutate: archiveProduct, isPending: PendingArchive } = useMutation({
    mutationKey: ['archiveProduct'],
    mutationFn: async (data: any) => {
      try {
        const { motif, raison } = data
        const response = await api.delete(
          `/products/delete/${productId}?reason=${encodeURIComponent(raison)}&motif=${encodeURIComponent(motif)}`
        )
        return response
      } catch (error) {
        throw new Error('Error archiving product')
      }
    },
    onSuccess: (data) => {
      notif.notify(NotificationType.SUCCESS, 'Produit archivé avec succès')
      router.back()
    },
    onError: (error) => {
      notif.notify(NotificationType.ERROR, 'Erreur archivage produit')
    },
  })
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    mode: 'onBlur',
    defaultValues: { ...product },
  })

  const onSubmit = (data: z.infer<typeof ProductSchema>) => {
    mutate(data)
  }
  const handleArchive = (data: any) => {
    archiveProduct(data)
  }

  const { handleSubmit } = form

  return (
    <>
      <div className='mb-48 flex h-full min-h-full w-full flex-col gap-3 bg-lynch-50 p-3 lg:mb-0 lg:bg-transparent lg:p-0'>
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
          handleEdit={() => {
            if (edit && !readOnly) {
              setReadOnly(true)
            } else if (!edit && readOnly) {
              setReadOnly(false)
            }
            setEdit((prev) => !prev)
          }}
          productId={productId}
          edit={edit}
          condition={condition}
          setCondition={setCondition}
          onSubmitCondition={onSubmitCondition}
        />
        <div className='sticky bottom-0 left-0 right-0 z-40 flex w-full rounded-t-lg bg-white p-3 lg:hidden'>
          {!edit ? (
            <Archiver
              onSubmit={handleArchive}
              title='Archive Produit'
              asChild
              isPending={isPending || PendingArchive}
            />
          ) : (
            <CustomButton
              label='CONFIRMER'
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
