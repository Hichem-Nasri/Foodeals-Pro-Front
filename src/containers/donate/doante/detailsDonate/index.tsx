'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import { Form } from '@/components/ui/form'
import { DealType } from '@/types/market-pro-type'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import InfoProduct from './InfoProduct'
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  PenLine,
  Plus,
  Send,
  Trash,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { useMutation } from '@tanstack/react-query'
import DeleteDeal from './DeleteDeal'
import { StepTwoDonate } from './StepTwoDonate'
import { StepThreeDonate } from './StepTreeDonate'
import {
  DonateType,
  DonateSchema,
  MultiProductType,
  MultiProductSchema,
} from '@/schemas/donate-schema'
import DialogMultiProduct from './MutliProductStep'
import { SelectField } from '@/components/custom/SelectField'
import { capitalize } from '@/utils/utils'
import HeaderLine from '@/components/utils/HeaderLine'
import MultiProductCard from './MultiProductCard'
import Grid from '@/components/utils/Grid'
import { date } from 'zod'
import { format } from 'date-fns'
import api from '@/utils/api'
import { DonateRoutes } from '@/lib/routes'
import RelaunchButtonWithDialog from '@/app/[locale]/pro-market/offres/components/RelaunchButtonWithDialog'
import HistoryEdit from './HistoryEdit'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface DonateDeatailsProps {
  donate: DonateType
  id: string
  isHistory?: boolean
}

export interface DonateBackendReq {
  donationType: string
  donationUnity: string
  deliveryFee: number
  donateDelivryMethod: string
  openTimes: OpenTime[]
  products: Product[]
  photosProducts: File[]
}

export interface OpenTime {
  day: string
  from: string
  to: string
}

export interface Product {
  title: string
  description: string
  expirationDate: string | Date
  quantity: number
}

const getAllDataBackend: (data: DonateType) => DonateBackendReq = (
  data: DonateType
) => {
  const photosProducts =
    data.type == 'MULTIPLE'
      ? data?.MultiProductSchema?.map((item) =>
          typeof item.productImages == 'string' ? null : item.productImages
        )
      : [typeof data.productImages == 'string' ? null : data.productImages]
  const products: Product[] =
    data.type == 'MULTIPLE'
      ? data.MultiProductSchema?.map((item) => ({
          title: item.title || '',
          description: item.description || '',
          expirationDate:
            format(item.expirationDate?.toString() || '', 'yyy-MM-dd') || '',
          quantity: item.quantity || 0,
        })) || []
      : [
          {
            title: data.title,
            description: data.description,
            expirationDate:
              format(data.expirationDate?.toString() || '', 'yyy-MM-dd') || '',
            quantity: data.quantity,
          },
        ]

  return {
    deliveryFee: data.deliveryCost,
    donationType: data.type == 'MULTIPLE' ? 'MULTIPLE' : 'ONE',
    donationUnity: 'KG', //TODO: Change this part
    donateDelivryMethod: data.consumptionMethods,
    openTimes: [
      {
        day: data.startDate.toISOString(),
        from: data.startTime.padStart(2, '0').replace('h', ':'),
        to: data.endTime.padStart(2, '0').replace('h', ':'),
      },
      {
        day: data.endDate.toISOString(),
        from: data.startTime.padStart(2, '0').replace('h', ':'),
        to: data.endTime.padStart(2, '0').replace('h', ':'),
      },
    ],
    products: products,
    photosProducts: photosProducts,
  } as DonateBackendReq
}

export type produtRequestType = {
  name: string
  title: string
  description: string
  barcode: string | null
  type: string | null
  price: string | null
  productImagePath: string | null
  categoryId: string | null
  subCategoryId: string | null
  brand: string | null
  rayonId: string | null
  expirationDate: string | null
}

const prodReqDemo: produtRequestType = {
  name: '',
  title: '',
  description: '',
  barcode: null,
  type: 'GLOBAL',
  price: null,
  productImagePath: null,
  categoryId: null,
  subCategoryId: null,
  brand: null,
  rayonId: null,
  expirationDate: null,
}

const DonateCreation: React.FC<DonateDeatailsProps> = ({
  donate,
  id,
  isHistory = false,
}) => {
  const [state, setState] = useState<'info' | 'modalie' | 'payment'>('info')
  const [edit, setEdit] = useState(!id || id == '')
  const [donateId, setDonateId] = useState(id)
  const [prodReq, setProdReq] = useState<produtRequestType | null>(null)
  const [multiProduct, setMultiProduct] = useState<MultiProductType[]>(() => {
    if (donate.type == 'MULTIPLE' && donate.MultiProductSchema)
      return donate.MultiProductSchema.map(
        (item) =>
          ({
            ...item,
            productImages: '/images/' + item.productImages,
          }) as MultiProductType
      )
    return []
  })
  const router = useRouter()
  const { notify } = useNotification()
  const t = useDonateTranslations()

  const { mutate, isPending } = useMutation({
    mutationKey: ['donate'],
    mutationFn: async (data: DonateType) => {
      const { photosProducts, ...donate } = getAllDataBackend(data)
      console.log('donate: ', JSON.stringify(donate))
      const blob = new Blob([JSON.stringify(donate)], {
        type: 'application/json',
      })
      console.log('photosProducts: ', photosProducts)
      const formData = new FormData()
      formData.append('donate', blob)
      photosProducts.forEach((image) => {
        formData.append('photosProducts', image)
      })
      const method = donateId ? 'put' : 'post'
      const url = donateId ? `/donates/${donateId}` : `/donates`
      const res = await api[method](url, formData)

      console.log('res: ', res.status)
      if (res.status !== 201) {
        throw new Error(t('messages.donateAddError'))
      }
      return res.data
    },
    onSuccess(data) {
      setDonateId(data.id)
      notify(NotificationType.SUCCESS, t('messages.donateAddedSuccess'), 'dialog')
      router.push(DonateRoutes.donate)
    },
    onError(error) {
      notify(NotificationType.ERROR, error.message)
    },
  })
  const form = useForm<DonateType>({
    resolver: zodResolver(DonateSchema),
    mode: 'onChange',
    defaultValues: { ...donate },
    disabled: !edit,
  })

  const onSubmit = (data: DonateType) => {
    mutate(data)
    console.log('data: ', data)
  }
  const handleNext = async () => {
    let next = false
    if (state == 'info') {
      if (form.watch('type') == 'MULTIPLE') {
        if (multiProduct.length == 0) {
          notify(NotificationType.INFO, t('form.addAtLeastOneProduct'))
          return
        }
        form.setValue('MultiProductSchema', multiProduct)
        next = true
      } else
        next = await form.trigger([
          'productImages',
          'title',
          'description',
          'type',
          'unity',
          'quantity',
        ])
      if (next) setState('modalie')
    } else if (state == 'modalie') {
      next = await form.trigger(['consumptionMethods', 'deliveryCost'])
      if (next) setState('payment')
    } else {
      next = await form.trigger([
        'startDate',
        'endDate',
        'startTime',
        'endTime',
      ])
      if (next) {
        console.log(form.formState.errors)
        console.log('data: ', form.getValues())
        onSubmit(form.getValues())
      }
    }
    if (!next) {
      notify(NotificationType.INFO, t('form.fillAllFields'))
    }
  }
  const handleBack = () => {
    if (state == 'info') {
      router.back()
    } else if (state == 'modalie') {
      setState('info')
    } else {
      setState('modalie')
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit)
  const changeProdReq = (data: any) => {
    console.log('prod: ', data)
    setProdReq({
      ...prodReqDemo,
      name: data.name,
      title: data.name,
      categoryId: data.category.id,
      subCategoryId: data.subCategory.id,
      description: data.description,
      barcode: data.barcode,
    } as produtRequestType)
    form.setValue('barCode', data?.barcode || '')
    form.setValue('id', data.id || '')
    form.setValue('title', data?.name || '')
    form.setValue('description', data?.description || '')
    form.setValue(
      'productImages',
      process.env.NEXT_PUBLIC_BASE_URL + '/photos/' + data?.imageUrl
    )
  }
  const handleRelaunch = async () => {
    try {
      const res = await api.put(`/donates/relaunch/${donateId}`)
      if (![200, 201, 204, 202].includes(res.status)) {
        throw new Error(t('messages.donateRelaunchError'))
      } else {
        notify(NotificationType.SUCCESS, t('messages.donateRelaunchedSuccess'))
        router.push(DonateRoutes.donate)
      }
    } catch (e) {
      notify(NotificationType.ERROR, t('messages.donateRelaunchError'))
    }
    console.log('Relancer')
  }
  const [type, setType] = useState<string>(form.watch('type'))
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [state])
  // useEffect(() => {
  //   if (!type ) setType(donate.type)
  //     else
  //   setType(form.watch('type'))
  // }, [type])
  return (
    <Form {...form} >
      <div className='flex h-full w-full flex-col items-center justify-between container mx-auto'>
        <div
          className={`sticky bottom-0 left-0 z-50 hidden w-full gap-3 rounded-t-[18px] bg-white p-2 shadow-sm lg:right-0 lg:top-0 lg:flex lg:justify-end lg:rounded-[18px]`}
        >
          {isHistory ? (
            <div className='hidden h-12 w-fit gap-3 lg:inline-flex'>
              <RelaunchButtonWithDialog
                color='blue'
                title={t('form.relaunchDonation')}
                description={t('form.relaunchQuestion')}
                actionFn={handleRelaunch}
                className='h-12 border-[1px] border-scooter-500 text-scooter-500 hover:bg-scooter-500 hover:text-white'
              />
              <CustomButton
                variant='outline'
                label={t('actions.archive')}
                size={'sm'}
                type='button'
                className={`w-full rounded-[18px] lg:w-fit`}
                onClick={() => {
                  //TODO: handle Archive
                }}
                disabled={isPending}
                IconRight={Archive}
              />
            </div>
          ) : (
            <CustomButton
              variant='outline'
              label={edit ? (state == 'info' ? t('form.cancel') : t('form.back')) : 'ROUTER'}
              size={'sm'}
              type='button'
              className={`w-full rounded-[18px] lg:w-fit`}
              onClick={handleBack}
              disabled={isPending}
              IconRight={state == 'info' ? X : ArrowLeft}
            />
          )}

          <CustomButton
            label={
              edit ? (state == 'payment' ? t('form.publish') : t('form.next')) : t('form.modify')
            }
            className={`w-full rounded-[18px] bg-scooter-500 hover:bg-scooter-100 hover:text-scooter-500 lg:w-fit`}
            size={'sm'}
            disabled={isPending}
            onClick={() => {
              if (edit) handleNext()
              else {
                setState('info')
                setEdit(true)
              }
            }}
            isPending={state == 'payment' ? isPending : false}
            IconRight={
              edit ? (state == 'payment' ? Send : ArrowRight) : PenLine
            }
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className='flex h-full w-full flex-col gap-3 p-2 lg:p-0 lg:py-2'
        >
          {(state == 'info' || !edit) &&
            (type !== 'MULTIPLE' ? (
              <InfoProduct
                disabled={!edit}
                changeProdReq={changeProdReq}
                handleRelaunch={handleRelaunch}
                id={donateId}
              />
            ) : (
              <InfoMultiProduct
                form={form}
                setMultiProduct={setMultiProduct}
                multiProduct={multiProduct}
                disabled={!edit}
                type={type}
              />
            ))}
          {(state == 'modalie' || !edit) && <StepTwoDonate />}
          {(state == 'payment' || !edit) && <StepThreeDonate />}
          {isHistory && donateId && (
            <HistoryEdit {...donate.relaunchModifyResponse} />
          )}
          {donateId && (
            <div className='flex w-full items-center justify-normal rounded-[30px] bg-white p-3 lg:justify-end lg:rounded-[18px]'>
              <DeleteDeal id={donateId} disable={edit} />
            </div>
          )}
        </form>
        <div
          className={`sticky bottom-0 left-0 z-50 flex w-full gap-3 rounded-t-[18px] bg-white p-4 shadow-sm lg:right-0 lg:top-0 lg:hidden lg:justify-end lg:rounded-[18px]`}
        >
          {!isHistory ? (
            <CustomButton
              variant='outline'
              label={edit ? (state == 'info' ? t('form.cancel') : t('form.back')) : 'ROUTER'}
              size={'sm'}
              type='button'
              className='w-full rounded-[18px] lg:w-fit'
              onClick={handleBack}
              disabled={isPending}
              IconRight={state == 'info' ? X : ArrowLeft}
            />
          ) : (
            <CustomButton
              variant='outline'
              label={t('actions.archive')}
              size={'sm'}
              type='button'
              className={`w-full rounded-[18px] lg:w-fit`}
              onClick={() => {
                //TODO: handle Archive
              }}
              disabled={isPending}
              IconRight={Archive}
            />
          )}
          <CustomButton
            label={
              edit ? (state == 'payment' ? t('form.publish') : t('form.next')) : t('form.modify')
            }
            className={`w-full rounded-[18px] bg-scooter-500 hover:bg-scooter-100 hover:text-scooter-500 lg:w-fit`}
            size={'sm'}
            disabled={isPending}
            onClick={() => {
              if (edit) handleNext()
              else {
                setState('info')
                setEdit(true)
              }
            }}
            IconRight={
              edit ? (state == 'payment' ? Send : ArrowRight) : PenLine
            }
          />
        </div>
      </div>
    </Form>
  )
}

export const InfoMultiProduct = ({
  form,
  setMultiProduct,
  multiProduct,
  disabled = false,
  type,
}: {
  form: UseFormReturn<DonateType>
  setMultiProduct: React.Dispatch<React.SetStateAction<MultiProductType[]>>
  multiProduct: MultiProductType[]
  disabled?: boolean
  type: string
}) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editProduct, setEditProduct] = useState<MultiProductType | null>(null)
  const [count, setCount] = useState(0)
  const t = useDonateTranslations()
  
  const formProduct = useForm<MultiProductType>({
    resolver: zodResolver(MultiProductSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      quantity: 0,
      description: '',
      id: '' + count,
      productImages: '',
      expirationDate: new Date(),
    },
  })
  const handleSubmit = (data: MultiProductType) => {
    console.log('new Product')
    if (editProduct) {
      const index = multiProduct.findIndex((item) => item.id == editProduct.id)
      multiProduct[index] = data
      setMultiProduct([...multiProduct])
    } else {
      const product = {
        ...data,
        id: count.toString(),
      }
      console.log('product: ', product)
      setMultiProduct((prev) => [...prev, product])
      setCount(count + 1)
    }
    setOpenDialog(false)
  }
  return (
    <>
      <div className='flex w-full flex-col gap-3'>
        <div className='flex w-full flex-col items-start gap-3 rounded-[18px] bg-white p-4'>
          <SelectField
            control={form.control}
            name='type'
            disabled={disabled}
            label={t('form.donationType')}
            className='w-full lg:w-1/3'
            options={['UN_PRODUIT', 'MULTIPLE'].map((item) => ({
              label: item
                .split('_')
                .map((val) => capitalize(val))
                .join(' '),
              key: item,
            }))}
          />
        </div>
        <HeaderLine title={t('form.productsList')} />
        <div className='item-end flex w-full flex-col gap-3'>
          <CustomButton
            label={t('form.addProduct')}
            size={'sm'}
            type='button'
            className='w-full self-end rounded-[18px] bg-scooter-500 hover:bg-scooter-100 hover:text-scooter-500 lg:w-fit'
            onClick={() => {
              console.log('clear')
              formProduct.reset()
              setEditProduct(null)
              setOpenDialog(true)
            }}
            disabled={disabled}
            IconRight={Plus}
          />
          <Grid>
            {multiProduct.map((item, index) => (
              <MultiProductCard
                id={index}
                Item={item}
                setItems={setMultiProduct}
                disabled={disabled}
                setModify={(id: number) => {
                  ;(Object.keys(item) as Array<keyof MultiProductType>).forEach(
                    (key) => {
                      if (key == 'productImages') {
                        formProduct.setValue(
                          key,
                          typeof item[key] == 'string'
                            ? item[key]
                            : URL.createObjectURL(item[key]!)
                        )
                      } else if (key == 'expirationDate') {
                        formProduct.setValue(
                          key,
                          new Date(item[key] as unknown as string)
                        )
                      } else formProduct.setValue(key, item[key])
                    }
                  )
                  setEditProduct(item)
                  setOpenDialog(true)
                }}
              />
            ))}
          </Grid>
        </div>
      </div>
      <DialogMultiProduct
        form={formProduct}
        open={openDialog}
        setOpen={setOpenDialog}
        onSubmit={handleSubmit}
        type={type}
        edit={!!editProduct}
      />
    </>
  )
}

export default DonateCreation
