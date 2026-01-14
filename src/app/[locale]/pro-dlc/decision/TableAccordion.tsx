import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PartnerSolutionType } from '@/types/GlobalType'
import React, { useMemo } from 'react'
import { dlcDecisionType } from '.'
import { getColumnsDecision } from './columnDecision'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { DataTable } from '@/components/tools/DataTable'
import ProductCardDlc from '@/containers/pro_dlc/ProductCardDlc'
import { useTranslations } from '@/hooks/useTranslations'
import { get } from 'http';

interface TableAccordionProps {
  type: PartnerSolutionType
  data: dlcDecisionType[]
  isLoading?: boolean
}

const TableAccordion: React.FC<TableAccordionProps> = ({
  data,
  type,
  isLoading,
}) => {
  const { t } = useTranslations()
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  
  const columns = getColumnsDecision(t)

  const table = useReactTable({
    data,
    columns: columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  
  const header = (() => {
    switch (type) {
      case PartnerSolutionType.DLC_PRO:
        return t('dlc.title', 'DLC')
      case PartnerSolutionType.DONATE_PRO:
        return t('navigation.donate', 'Donate Pro')
      case PartnerSolutionType.MARKET_PRO:
        return t('navigation.dealPro', 'Market Pro')
      default:
        return t('dlc.title', 'DLC')
    }
  })()
  
  return (
    <div className='flex w-full flex-col gap-4 p-2 lg:p-0'>
      <Accordion
        type='single'
        collapsible
        className='min-w-full rounded-[14px] bg-white px-4 py-6 lg:p-5'
        defaultValue='dlc'
      >
        <AccordionItem
          value='dlc'
          className='min-w-full text-[1.375rem] font-normal text-lynch-400'
        >
          <AccordionTrigger className='w-full py-0 text-[1.375rem] font-normal'>
            {isLoading ? t('common.loading', 'Loading...') : <>{header}</>}
          </AccordionTrigger>
          <AccordionContent className='w-full pt-7'>
            <DataTable
              data={data}
              table={table}
              title=''
              isLoading={isLoading}
              transform={(value) => <ProductCardDlc product={value} />}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default TableAccordion
