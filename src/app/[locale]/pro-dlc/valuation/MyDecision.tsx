'use client'
import { DataTable } from '@/components/tools/DataTable'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  columnsProducts,
  columnsProductsRedio,
} from '@/containers/pro_dlc/DlcProductColumn'
import ProductCardDlc from '@/containers/pro_dlc/ProductCardDlc'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import TicketCard from '../product-ticket/Ticket'
import { CustomButton } from '@/components/custom/CustomButton'
import { Calendar, CalendarDays, PrinterCheck } from 'lucide-react'
import { saveAs } from 'file-saver'
import HeaderLine from '@/components/utils/HeaderLine'
import { DlcRoutes } from '@/lib/routes'
import { useProductDlc } from '../_context/useProduct'
import { set } from 'date-fns'
import DLCProduct from '@/types/DlcProduct'
import { parse } from 'path'
import { useValuationTranslations, useDlcTranslations } from '@/hooks/useTranslations'

interface MyDecisionProps {}

const getNewPrice = (product: DLCProduct) => {
  // check range of product souhiatable or exigee or urgente, 0 < urgent < 10 < exigee < 20 < souhaitable, after that return the new price of the product precentage of the type multiplied by the old price
  if (product.type === 'urgente') {
    return (
      (product.price.amount * parseFloat(product.prgAConsommerBientot)) / 100
    )
  } else if (product.type === 'exigée') {
    return (product.price.amount * parseFloat(product.prgEncoreFraiche)) / 100
  } else {
    return (product.price.amount * parseFloat(product.prgFraiche)) / 100
  }
}

const MyDecision: React.FC<MyDecisionProps> = ({}) => {
  const router = useRouter()
  const [imageSaved, setImageSaved] = useState('')
  const { productDlc } = useProductDlc()
  const t = useValuationTranslations()
  const tDlc = useDlcTranslations()
  
  const [ticketData] = useState({
    name: 'PERLY VANILLE',
    description: 'Yaourts À La Cuillère Rayon 18 - Etg #025',
    barcode: '123456789012',
    oldPrice: 299.9,
    newPrice: 105.5,
  })
  console.log('DlcHistory rendered at:', new Date().toISOString())
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [selected, setSelected] = useState<string>(
    productDlc.length ? productDlc[0]?.id : ''
  )
  const [product, setProduct] = useState<DLCProduct | null>(null)
  const productTable = useReactTable({
    data: productDlc,
    columns: columnsProductsRedio(selected, setSelected),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  })
  useEffect(() => {
    if (productDlc.length) {
      setProduct(productDlc.find((p) => p.id === selected) || null)
      setImageSaved('')
    } else {
      router.push(DlcRoutes.dlc)
    }
  }, [selected, productDlc])
  return (
    <div className='flex w-full flex-col gap-4'>
      <Accordion
        type='single'
        collapsible
        className='min-w-full rounded-[14px] bg-transparent p-2 lg:bg-white lg:p-5'
        defaultValue='product'
      >
        <AccordionItem
          value='product'
          className='flex min-w-full flex-col gap-3 text-[1.375rem] font-normal text-lynch-400 lg:gap-0'
        >
          <AccordionTrigger className='hidden w-full py-0 text-[1.375rem] font-normal lg:inline-flex'>
            {t('decisions.title')}
          </AccordionTrigger>
          <HeaderLine title={t('decisions.title')} className='flex lg:hidden' />
          <AccordionContent className='w-full pt-0 lg:pt-7'>
            <DataTable
              data={productDlc}
              table={productTable}
              title=''
              transform={(product) => (
                <>
                  <ProductCardDlc
                    product={product}
                    borderColor={
                      product?.type === 'urgente'
                        ? 'border-coral-500'
                        : product.type == 'exigée'
                          ? 'border-tulip-600'
                          : 'border-primary'
                    }
                    isSelectionMode
                    onSelect={(id) =>
                      selected !== product.id
                        ? setSelected(id)
                        : setSelected('')
                    }
                    isSelected={selected === product.id}
                  />
                </>
              )}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        type='single'
        collapsible
        className='min-w-full rounded-[14px] bg-transparent p-2 lg:bg-white lg:p-5'
        defaultValue='product'
      >
        <AccordionItem
          value='product'
          className='min-w-full text-[1.375rem] font-normal text-lynch-400'
        >
          <AccordionTrigger className='hidden w-full py-0 text-[1.375rem] font-normal lg:inline-flex'>
            {t('ticket.title')}
          </AccordionTrigger>
          <HeaderLine title={t('ticket.title')} className='flex lg:hidden' />
          <AccordionContent className='w-full pt-0 lg:pt-7'>
            {product ? (
              <TicketCard
                name={product.name}
                description={product.description}
                barcode={product.barCode}
                oldPrice={product.price.amount}
                newPrice={getNewPrice(product)}
                setImageSaved={setImageSaved}
                imageSaved={imageSaved}
              />
            ) : (
              <div className='flex h-52 w-full items-center justify-center text-lynch-400'>
                {t('selectProduct')}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className='sticky bottom-0 left-0 flex w-full flex-col items-center justify-end gap-3 rounded-[14px] rounded-t-[18px] bg-white p-3 lg:flex-row'>
        <CustomButton
          size={'sm'}
          label={t('actions.goToDecision')}
          onClick={() => {
            router.push(DlcRoutes.Decision)
          }}
          IconRight={CalendarDays}
          variant='outline'
          className='w-full lg:w-auto'
        />
        <CustomButton
          size={'sm'}
          label={t('actions.printSticker')}
          onClick={() => {
            saveAs(
              imageSaved,
              `ticket-${
                product?.name
                  .split(' ')
                  .map((item) => item.toLowerCase())
                  .join('-') ||
                product?.barCode ||
                'foodeals'
              }.png`
            )
          }}
          disabled={!imageSaved || imageSaved === ''}
          IconRight={PrinterCheck}
          className='w-full border-2 border-white bg-tulip-400 text-white transition-colors hover:border-tulip-400 hover:bg-tulip-100 hover:text-tulip-400 lg:w-auto'
        />
      </div>
    </div>
  )
}

export default MyDecision
