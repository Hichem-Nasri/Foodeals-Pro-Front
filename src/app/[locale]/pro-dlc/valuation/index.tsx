'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  HandCoins,
  ShoppingBag,
  HeartHandshake,
  Salad,
  CalendarCheck,
  ArrowLeft,
} from 'lucide-react'
import ProductCardDlc from '@/containers/pro_dlc/ProductCardDlc'
import DLCProduct from '@/types/DlcProduct'
import { PriceReductionSlider } from './sliders'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useProductDlc } from '../_context/useProduct'
import Modality from './Modality'
import { CustomButton } from '@/components/custom/CustomButton'
import ValuationProduct from './ValuationProduct'
import { appApi, DlcRoutes } from '@/lib/routes'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { useValuationTranslations, useDlcTranslations, useCommonTranslations } from '@/hooks/useTranslations'

interface ValueInputProps {
  icon: React.ElementType
  label: string
  color: string
  bgColor: string
  value: number
  onChange: (value: number) => void
  max: number
}

export interface ValuationForm {
  proDlc: number
  proMarket: number
  proDonate: number
  reduction: number
}

export interface GroupedProducts {
  [key: string]: {
    type: 'urgente' | 'exigée' | 'souhaitable'
    products: DLCProduct[]
  }
}

const typeConfig = {
  urgente: {
    title: 'Valorisation urgente',
    color: '#EF4444',
    bgColor: '#FEF2F2',
  },
  exigée: {
    title: 'Valorisation exigée',
    color: '#FAC215',
    bgColor: '#FEF9E7',
  },
  souhaitable: {
    title: 'Valorisation souhaitable',
    color: '#34D39E',
    bgColor: '#ECFDF5',
  },
}

const ValueInput = ({
  icon: Icon,
  label,
  color,
  bgColor,
  value,
  onChange,
  max,
}: ValueInputProps) => (
  <div className='relative flex items-center justify-between gap-2 rounded-lg bg-[#F6F7F9] p-2'>
    <span className='text-sm text-gray-500'>X</span>
    {/* <label htmlFor={label} className='debug absolute h-full w-full' /> */}
    <input
      type='number'
      name={label}
      value={value === 0 ? '' : value}
      onChange={(e) => {
        if (!e.target.value || e.target.value === '0') {
          onChange(0)
        }
        const value = parseInt(e.target.value)
        if (value > 0 && value <= max) {
          onChange(value)
        }
      }}
      className='absolute z-0 ml-3 mr-10 h-full w-[calc(100%-24px)] bg-transparent text-sm text-gray-500 focus-within:border-0 focus-within:outline-none focus-within:ring-0'
      min={0}
      max={max}
    />
    {/* {max} */}
    <div
      className={`z-10 ml-auto flex w-fit items-center gap-1 rounded-full px-3 py-1.5`}
      style={{ backgroundColor: bgColor }}
    >
      <Icon size={20} color={color} />
      <span
        className='line-clamp-1 text-ellipsis text-xs font-bold'
        style={{ color }}
      >
        {label}
      </span>
    </div>
  </div>
)

export default function Valuation() {
  const router = useRouter()
  const { productDlc } = useProductDlc()
  const t = useValuationTranslations()
  const tDlc = useDlcTranslations()
  const tCommon = useCommonTranslations()
  
  const getTypeConfig = (type: 'urgente' | 'exigée' | 'souhaitable') => {
    const baseConfig = {
      urgente: {
        color: '#EF4444',
        bgColor: '#FEF2F2',
      },
      exigée: {
        color: '#FAC215',
        bgColor: '#FEF9E7',
      },
      souhaitable: {
        color: '#34D39E',
        bgColor: '#ECFDF5',
      },
    }
    
    return {
      title: tDlc(`types.${type === 'urgente' ? 'urgent' : type === 'exigée' ? 'required' : 'desirable'}`),
      ...baseConfig[type]
    }
  }
  
  console.log('productDlc:', productDlc)
  useEffect(() => {
    if (window !== undefined && !productDlc.length) {
      router.push(DlcRoutes.dlc)
    }
  }, [])
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    return productDlc.reduce(
      (acc, product) => {
        const key = `${product.type}-${product.id}`
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>
    )
  })
  const { notify } = useNotification()
  const [forms, setForms] = useState<Record<string, ValuationForm>>({})
  const [products, setProducts] = useState<DLCProduct[]>(productDlc)
  const { mutate, isPending } = useMutation({
    mutationKey: ['valuation'],
    mutationFn: async (data: any) => {
      const res = await api.post(appApi.dlc + '/valoriser-dlc', data)
      if (res.status !== 200) {
        throw new Error('Erreur lors de la valorisation')
      }
      return res.data
    },
    onSuccess: () => {
      notify(NotificationType.SUCCESS, 'Valorisation effectuée avec succès')
      router.push(DlcRoutes.Valuation + `?show=ticket`)
    },
    onError: (error) => {
      notify(NotificationType.ERROR, error.message)
      console.error(error)
    },
  })
  const groupProducts = (products: DLCProduct[]): GroupedProducts => {
    return products.reduce((acc: GroupedProducts, product) => {
      console.log('productId: ', product.id)
      const key = `${product.type}-${product.id}`

      if (!acc[key]) {
        acc[key] = {
          type: product.type,
          products: [],
        }
      }

      acc[key].products.push({ ...product })

      acc[key].products.sort(
        (a, b) =>
          new Date(b.creationDate).getTime() -
          new Date(a.creationDate).getTime()
      )

      return acc
    }, {})
  }
  const handleFormChange = (
    groupKey: string,
    field: keyof ValuationForm,
    value: number
  ) => {
    setForms((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [field]: value,
      },
    }))
  }

  const getExpiryDate = (id: string) => {
    const product = products.find((p) => p.id === id)
    // data : 30/01/2025
    const date = new Date(product?.dateAConsommerBientot! || '')
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const handleSubmit = async () => {
    const formData = Object.entries(forms).map(([key, form]) => {
      console.log('key: ', key)
      return {
        products: groupedProducts[key].products.map((p) => p.id),
        ...form,
      }
    })

    try {
      console.log('formData:', formData)
      const reqBody = formData.map((data) => {
        const solutions = ['proDlc', 'proMarket', 'proDonate'].map(
          (solution) => {
            const quantity =
              Object.entries(data)
                .filter(([key, value]) => {
                  return key === solution
                })
                .map(([solution, quantity]) => quantity)[0] || 0

            switch (solution) {
              case 'proDlc':
                return {
                  solutionName: 'dlc',
                  quantity: quantity,
                }
              case 'proMarket':
                return {
                  solutionName: 'pro_market',
                  quantity: quantity,
                }
              case 'proDonate':
                return {
                  solutionName: 'pro_donate',
                  quantity: quantity,
                }
              default:
                return {
                  solutionName: solution,
                  quantity: 0,
                }
            }
          }
        )
        // add other solution with 0 quantity

        return {
          dlcId: data.products[0],
          expiryDate: getExpiryDate(data.products[0]),
          discount: data.reduction || 0,
          solutions,
        }
      })
      console.log('reqBody:', JSON.stringify(reqBody))
      mutate(reqBody)
      //TODO: handle success
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  const getRestValue = (key: string) => {
    const group = groupedProducts[key]
    const sum = group.products.reduce(
      (acc, product) => acc + product.quantity,
      0
    )
    const sumValue =
      forms[key]?.proMarket + forms[key]?.proDonate + forms[key]?.proDlc || 0
    return sum - sumValue >= 0 ? sum - sumValue : 0
  }

  const groupedProducts = groupProducts(products)

  return (
    <div className='flex w-full flex-col gap-4 bg-[#F6F7F9]'>
      <div className='mx-auto flex w-full flex-col gap-4 p-3 lg:p-0'>
        {Object.entries(groupedProducts).map(([key, group]) => (
          <Accordion
            key={key}
            type='single'
            collapsible
            className='min-w-full rounded-[30px] bg-white px-4 py-6 lg:p-5'
            defaultValue='partnerInfo'
          >
            <AccordionItem
              value='partnerInfo'
              className='min-w-full text-[1.375rem] font-normal text-lynch-400'
            >
              <AccordionTrigger className='py-0 text-xl font-medium text-lynch-500'>
                {getTypeConfig(group.type).title}
              </AccordionTrigger>
              <AccordionContent className='w-full pt-7'>
                {expandedSections[key] && (
                  <div className='space-y-4 lg:space-y-8'>
                    {/* Products Grid */}
                    <div className='flex flex-col gap-4 lg:flex-row lg:flex-wrap'>
                      {group.products.map((product) => (
                        <div
                          key={product.id}
                          className='w-full min-w-[300px] lg:w-[calc(33.33%-1rem)]'
                        >
                          <ProductCardDlc
                            product={product}
                            isSelected
                            borderColor={getTypeConfig(group.type).color}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Condition de retrait */}
                    <div className='mt-4 flex items-center gap-4 lg:mt-8'>
                      <h4 className='font-montserrat text-[18px] font-normal leading-[21.94px] text-[#8695AA]'>
                        {t('withdrawalConditions')}
                      </h4>
                      <div className='h-[0.55px] flex-1 bg-[#D7D7D7]' />
                    </div>

                    {/* Value Inputs */}
                    <div className='space-y-6 lg:mt-8'>
                      <h4 className='font-montserrat text-sm font-medium'>
                        {t('value')}
                      </h4>
                      <div className='grid w-full grid-cols-1 gap-3 lg:grid-cols-3'>
                        <div className='col-span-1 w-full'>
                          <ValueInput
                            icon={HandCoins}
                            label={t('solutions.proDlc')}
                            color='#EAB308'
                            bgColor='#FEF0C3'
                            max={getRestValue(key)}
                            value={forms[key]?.proDlc || 0}
                            onChange={(value: number) =>
                              handleFormChange(key, 'proDlc', value)
                            }
                          />
                        </div>
                        <div className='col-span-1 w-full'>
                          <ValueInput
                            icon={ShoppingBag}
                            label={t('solutions.proMarket')}
                            color='#10B981'
                            bgColor='#D1FAEC'
                            value={forms[key]?.proMarket || 0}
                            max={getRestValue(key)}
                            onChange={(value: number) =>
                              handleFormChange(key, 'proMarket', value)
                            }
                          />
                        </div>
                        <div className='col-span-1 w-full'>
                          <ValueInput
                            icon={HeartHandshake}
                            label={t('solutions.proDonate')}
                            color='#06B6D4'
                            bgColor='#CFF7FE'
                            value={forms[key]?.proDonate || 0}
                            max={getRestValue(key)}
                            onChange={(value: number) =>
                              handleFormChange(key, 'proDonate', value)
                            }
                          />
                        </div>
                      </div>

                      {/* Reduction and Price */}
                      <div className='w-full flex-1 py-4 pl-2'>
                        <PriceReductionSlider
                          value={forms[key]?.reduction || 0}
                          color={
                            key.includes('urgente')
                              ? 'bg-coral-500'
                              : key.includes('exigée')
                                ? 'bg-tulip-400'
                                : 'bg-mountain-400'
                          }
                          initialPrice={group.products.reduce(
                            (acc, product) => acc + product.price.amount,
                            0
                          )}
                          onChange={(values: number) =>
                            handleFormChange(key, 'reduction', values)
                          }
                          className='w-full'
                        />
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      <Modality />

      <div className='sticky bottom-0 left-0 flex w-full flex-col items-center justify-normal gap-2 rounded-t-2xl bg-white p-4 lg:flex-row lg:justify-between'>
        <CustomButton
          variant='outline'
          size={'sm'}
          label={t('actions.back')}
          IconRight={ArrowLeft}
          className='hidden lg:flex'
          onClick={() => {
            router.push(DlcRoutes.dlc)
          }}
        />
        <div className='flex w-full flex-col items-center justify-center gap-2 lg:flex-row-reverse lg:justify-start'>
          <ValuationProduct
            actionFn={() => handleSubmit()}
            product={groupedProducts}
            forms={forms}
            // disabled={isPending}
          >
            <CustomButton
              size='sm'
              label={t('actions.valorize')}
              IconRight={Salad}
              disabled={
                !Object.values(forms).every(
                  (form) => form.proDlc || form.proMarket || form.proDonate
                )
              }
              className='h-14 w-full bg-tulip-400 text-white hover:bg-tulip-400 lg:h-12 lg:w-fit'
            />
          </ValuationProduct>
          <CustomButton
            size='sm'
            label={t('actions.addPreparationDate')}
            IconRight={CalendarCheck}
            className='h-14 w-full border-2 border-tulip-400 bg-tulip-100/80 text-tulip-400 hover:bg-tulip-100 hover:text-tulip-400 lg:h-12 lg:w-fit'
          />
        </div>
      </div>
    </div>
  )
}
