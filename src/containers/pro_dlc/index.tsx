'use client'

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react'
import BarSection from './BarSection'
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'
import api from '@/utils/api'
import {
  NotificationType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import {
  appApi,
  DlcRoutes,
} from '@/lib/routes'
import { LastModification } from './last-modification'
import { FooterNav } from './footer-nav'
import DLCProduct from '@/types/DlcProduct'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { columnsProducts } from './DlcProductColumn'
import Product from './Products'
import { SelectionButton } from './ValuationIcon'
import {
  FilterSchemaProductDlc,
  defaultProductSchemaDlc,
} from '@/schemas/product-schema-dlc'
import { z } from 'zod'
import { useProductDlc } from '@/app/[locale]/pro-dlc/_context/useProduct'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useNotification } from '@/context/NotifContext'
import { ProductDlcExtract } from './utils/dataExtract'
import { CustomButton } from '@/components/custom/CustomButton'
import { X, Salad } from 'lucide-react'
import { cn } from '@/lib/utils'
import Switcher from './components/Switcher'
import { table } from 'console'
import { useTranslations } from '@/hooks/useTranslations'

const DLCHome = () => {
  const { t } = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get the initial tab state from URL or default to 'all'
  const tabFromUrl = searchParams.get('tab') as 'all' | 'urgente' | 'exigee' | 'souhaitable' | null;
  
  const [state, setState] = useState<
    | 'all'
    | 'urgente'
    | 'exigee'
    | 'souhaitable'
  >(tabFromUrl || 'all');
  
  // Function to update URL when tab changes
  const updateTabInUrl = (newTab: 'all' | 'urgente' | 'exigee' | 'souhaitable') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }
  
  // Custom setState that also updates URL
  const setStateWithUrl = (newState: React.SetStateAction<'all' | 'urgente' | 'exigee' | 'souhaitable'>) => {
    const newTab = typeof newState === 'function' ? newState(state) : newState;
    setState(newTab);
    updateTabInUrl(newTab);
  }
  const [products, setProducts] =
    useState<DLCProduct[]>([])
  const [totals, setTotals] =
    useState<TotalValueProps>(
      TotalValues
    )
  const [
    isSelectionMode,
    setIsSelectionMode,
  ] = useState(false)
  const [
    selectedProducts,
    setSelectedProducts,
  ] = useState<Set<string>>(new Set())
  const [
    filterFormData,
    setFilterFormData,
  ] = useState<
    z.infer<
      typeof FilterSchemaProductDlc
    >
  >(defaultProductSchemaDlc)

  const handleFilterSubmit = (
    data: z.infer<
      typeof FilterSchemaProductDlc
    >
  ) => {
    setFilterFormData(data)
    console.log(
      'from top level, ',
      data
    )
  }

  useEffect(() => {
    if (isSelectionMode) {
      const Element =
        document.getElementById(
          'dlc-mobile-bar'
        )
      if (Element) {
        Element.style.display = 'none'
      }
    } else {
      const Element =
        document.getElementById(
          'dlc-mobile-bar'
        )
      if (Element) {
        Element.style.display = 'block'
      }
    }
  }, [isSelectionMode])

  useEffect(() => {
    if (selectedProducts.size > 0) {
      const selectedProductsList =
        products.filter((product) =>
          selectedProducts.has(
            product.id
          )
        )
      console.log(
        'Selected Products:',
        selectedProductsList
      )
    }
  }, [selectedProducts, products])
  const { setProductDlc } =
    useProductDlc()
  const { notify } = useNotification()
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [
      'products-dlc',
      totals.currentPage,
      totals.pageSize,
      state,
    ],
    queryFn: async () => {
      try {
        // Simulate API delay

        const url =
          state === 'all'
            ? appApi.dlc + '?'
            : appApi.dlc +
              `/by-valorisation-type?valorisationType=${state.toUpperCase()}&`
        const res = await api.get(
          url +
            `pageNum=${totals.currentPage}&pageSize=${totals.pageSize}`
        )
        if (res.status !== 200) {
          throw new Error(
            t('messages.error.general')
          )
        }

        const { data } = res
        const allProducts =
          data.content.map(
            (item: any) =>
              ProductDlcExtract(item)
          )
        setTotals((prev) => ({
          ...prev,
          totalPages: data.totalPages,
        }))
        console.log(
          'content:   ',
          data.content
        )
        setProducts(allProducts)
        return data.content
      } catch (error) {
        notify(
          NotificationType.ERROR,
          t('messages.error.general')
        )
        console.log('response:', error)
        return []
      }
    },
    placeholderData: keepPreviousData,
  })

  return (
    <div className='flex min-h-full w-full flex-col items-center justify-between p-2 pb-0 lg:p-0'>
      <div className='flex w-full flex-col'>
        <div className='inline-flex lg:hidden'>
          <Switcher
            state={state}
            setState={setStateWithUrl}
            disabled={
              isLoading || isRefetching
            }
          />
          {/* <BarSection onTabChange={setSelectedTab} /> */}
        </div>
        <div
          className={`flex w-full flex-col gap-4 lg:flex-row lg:justify-between lg:gap-0`}
        >
          <Product
            selectedTab={state}
            setState={setStateWithUrl}
            products={products}
            refetch={refetch}
            isLoading={
              isLoading || isRefetching
            }
            isRefetching={isRefetching}
            totals={totals}
            setTotals={setTotals}
            isSelectionMode={
              isSelectionMode
            }
            selectedProducts={
              selectedProducts
            }
            onProductSelect={(id) => {
              setSelectedProducts(
                (prev) => {
                  const newSet =
                    new Set(prev)
                  if (newSet.has(id)) {
                    newSet.delete(id)
                  } else {
                    newSet.add(id)
                  }
                  return newSet
                }
              )
            }}
            onFilterSubmit={
              handleFilterSubmit
            } // Add this prop
            onToggle={() =>
              setIsSelectionMode(
                !isSelectionMode
              )
            }
          />
        </div>
      </div>
      <nav
        className={cn(
          'sticky bottom-0 left-0 flex w-full items-center justify-around gap-3 rounded-t-[32px] bg-white p-4 shadow-lg lg:hidden',
          {
            hidden: !isSelectionMode,
          }
        )}
        style={{}}
      >
        <CustomButton
          variant='outline'
          label={t('dlc.cancel')}
          onClick={() => {
            setIsSelectionMode(false)
            setSelectedProducts(
              new Set()
            )

            // Clear selected products
          }}
          className='w-full'
          IconLeft={X}
        />

        <CustomButton
          label={t('dlc.valorization')}
          onClick={() => {
            let values: DLCProduct[] =
              []
            products.forEach(
              (product) => {
                if (
                  selectedProducts.has(
                    product.id
                  )
                ) {
                  values.push(product)
                }
              }
            )
            setProductDlc(values)
            router.push(
              DlcRoutes.Valuation
            )
          }}
          className='w-full bg-[#FAC215] text-white hover:bg-[#FAC215]'
          IconRight={Salad}
        />
      </nav>
    </div>
  )
}

export default DLCHome
