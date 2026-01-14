'use client'
import DropDownList from '@/containers/pro_dlc/DropDownList'
import { useNotification } from '@/context/NotifContext'
import { appApi, DlcRoutes } from '@/lib/routes'
import DLCProduct from '@/types/DlcProduct'
import {
  NotificationType,
  PartnerSolutionType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import api from '@/utils/api'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { ColumnFiltersState } from '@tanstack/react-table'
import { ListFilter, ShoppingBasket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Fragment, useState } from 'react'
import TableAccordion from './TableAccordion'
import PaginationData from '@/components/tools/PaginationData'
import { CustomButton } from '@/components/custom/CustomButton'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import { SheetProduct } from '@/containers/gestions/Products/newProducts/SheetProduct'
import { NewImageProduct } from '@/containers/pro_dlc/newProducts/newImage'
import { ProductsType, ProductType } from '@/types/product-type'
import { useTranslations } from '@/hooks/useTranslations';

interface indexProps {}

export type dlcDecisionType = Pick<
  DLCProduct,
  'category' | 'subCategory' | 'name' | 'brand' | 'id' | 'quantity' | 'imageUrl'
> & {
  solution: PartnerSolutionType
}

export type SolutionMap = {
  [key in PartnerSolutionType]: dlcDecisionType[]
}

export const FilteredData = (data: dlcDecisionType[]): SolutionMap => {
  return data.reduce((acc: SolutionMap, product: dlcDecisionType) => {
    const solutionType = product.solution
    if (!acc[solutionType]) {
      acc[solutionType] = []
    }
    acc[solutionType].push({
      category: product.category,
      subCategory: product.subCategory,
      name: product.name,
      brand: product.brand,
      id: product.id,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
      solution: product.solution,
    })
    return acc
  }, {} as SolutionMap)
}



const importDataDlc: (data: any) => dlcDecisionType[] = (data) => {
  if (!data) return []
  return data.map((product: any) => {
    const { dlcResponse, solutionName, id, ...rest } = product
    const { productResponse, ...restDlc } = dlcResponse
    return {
      category: productResponse.category,
      subCategory: productResponse.subCategory,
      name: productResponse.name,
      brand: productResponse.brand,
      id: id,
      quantity: rest.quantity,
      imageUrl: 'http://localhost:8080/photos/' + productResponse.imageUrl,
      solution:
        solutionName == 'dlc'
          ? PartnerSolutionType.DLC_PRO
          : (solutionName as PartnerSolutionType),
    }
  })
}

const Decision: React.FC<indexProps> = () => {
  const { t } = useTranslations()
  const router = useRouter()
  const [sheet, setSheet] = useState(false)
  const [image, setImage] = useState(false)
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [product, setProduct] = useState<ProductsType[]>([])
  const [productConf, setProductConf] = useState<boolean>(false)
  const [products, setProducts] = useState<SolutionMap>(() => ({
    pro_dlc: [],
    pro_market: [],
    pro_donate: [],
    'PAS DE SOLUTION': [],
  }))
  const { notify } = useNotification()
  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ['products-dlc', 'decision'],
    queryFn: async () => {
      try {
        const res = await api.get(appApi.dlc + `/decisions`)
        if (res.status !== 200) {
          throw new Error(t('messages.error.general', 'An error occurred. Please try again.'))
        }
        const { pro_donate, pro_market, dlc } = res.data
        const data = [
          ...importDataDlc(pro_donate),
          ...importDataDlc(pro_market),
          ...importDataDlc(dlc),
        ]
        console.log('data: ', data)
        setProducts(FilteredData(data))
        return data
      } catch (error) {
        notify(
          NotificationType.ERROR,
          t('messages.error.general', 'Error retrieving DLC data')
        )
        return null
      }
    },
    placeholderData: keepPreviousData,
  })

  const handleScanProduct = (data: any) => {}
  return (
    <div className='flex w-full flex-col gap-4 pb-4 lg:pb-0'>
      {/* TODO: change this Mobile header when you marge */}
      <div className='hidden w-full justify-end rounded-[18px] bg-white p-2 lg:flex'>
        <DropDownList setSheet={setSheet} setImage={setImage}>
          <span>{t('dlc.add', 'Add a DLC')}</span>
          <ShoppingBasket size={22} />
        </DropDownList>
      </div>
      <div className='flex w-full items-center justify-between px-2 lg:hidden'>
        <h1 className='text-xl font-medium text-lynch-900'>{t('navigation.decision', 'Our decisions')}</h1>
        <CustomButton
          label=''
          variant='ghost'
          size={'sm'}
          IconLeft={ListFilter}
          className='size-12 rounded-full bg-white text-lynch-400 flex-center [&>.icon]:m-0'
        />
      </div>
      {data?.length === 0 && !isLoading ? (
        <EmptyListPlaceholder
          title='Pas de décisions'
          description='
        Vous n’avez pas encore pris de décisions sur les produits. Veuillez ajouter une décision pour chaque produit.'
          color='yellow'
        />
      ) : (
        Object.entries(products).map(([key, value]) => (
          <Fragment key={key}>
            <TableAccordion
              data={value as dlcDecisionType[]}
              type={key as PartnerSolutionType}
              isLoading={isLoading || isRefetching}
            />
          </Fragment>
        ))
      )}
      <PaginationData
        setCurrentPage={(page) => setTotals({ ...totals, currentPage: page })}
        currentPage={totals.currentPage}
        totalPages={totals.totalPages}
        pageSize={totals.pageSize}
      />
      <NewImageProduct
        open={image}
        setOpen={setImage}
        handleScanProduct={handleScanProduct}
        color='yellow'
      />
      <SheetProduct
        open={sheet}
        setOpen={setSheet}
        props={{
          setProducts: setProduct,
          setProductConf: setProductConf,
        }}
      />
    </div>
  )
}

export default Decision
