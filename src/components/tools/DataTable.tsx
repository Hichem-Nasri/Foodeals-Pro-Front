import {
  FC,
  Fragment,
  JSX,
  useEffect,
  useState,
} from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { flexRender } from '@tanstack/react-table'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { DataTableSkeleton } from './TableSkeleton'
import CardSkeleton from './CardSkeleton'
import { Label } from '../custom/Label'
import { CustomButton } from '../custom/CustomButton'
import FilterData from './FilterData'
import { Checkbox } from '../ui/checkbox'

interface FilterDataProps<T> {
  filterName: keyof T // The name of the property to filter by
  data: T[] // The array of data to filter
  filters: string[] // The array of filter values
  filterFn?: (
    item: T,
    filterValue: string
  ) => boolean // Optional custom filter function
}

interface DataTableProps<T> {
  title: string
  table: import('@tanstack/table-core').Table<T>
  data: T[]
  transform: (
    data: T
  ) => JSX.Element[] | JSX.Element
  hideColumns?: string[]
  partnerData?: {
    name: string
    avatar: string | null
    city: string
  }
  hidden?: boolean
  isLoading?: boolean
  back?: boolean
  onBack?: () => void
  filter?: string[]
  filterName?: string
  filterFn?: (
    item: T,
    filter: string
  ) => boolean
  checkbox?: boolean
  onChecked?: (checked: boolean) => void
  filterWeb?: boolean
}

export const DataTable: FC<
  DataTableProps<any>
> = ({
  title,
  transform,
  table,
  data,
  hideColumns,
  partnerData,
  hidden,
  isLoading,
  back = true,
  onBack,
  filter,
  filterName,
  filterFn,
  checkbox = false,
  onChecked,
  filterWeb = false,
}) => {
  const router = useRouter()
  const skeletonElements = Array.from(
    { length: 3 },
    (_, i) => i + 1
  )

  const handleBackClick = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const renderPartnerInfo = () => (
    <div className='flex items-center justify-start'>
      <Avatar>
        <AvatarImage
          src={partnerData?.avatar!}
        />
        <AvatarFallback>
          {partnerData?.name}
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-col gap-1'>
        <Label
          label={partnerData?.name!}
          className='text-base font-normal'
        />
        <Label
          label={partnerData?.city!}
          className='text-xs font-semibold text-primary'
        />
      </div>
    </div>
  )

  const renderTableHeader = () => (
    <TableHeader>
      {table
        .getHeaderGroups()
        .map((headerGroup, index) => (
          <TableRow
            key={headerGroup.id + index}
          >
            {headerGroup.headers.map(
              (header) =>
                !hideColumns?.includes(
                  header.id
                ) && (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      'min-w-40 cursor-pointer text-nowrap px-1',
                      {
                        'min-w-48':
                          header.column
                            .id ===
                            'createdAt' ||
                          header.column
                            .id ===
                            'date',
                        'min-w-28':
                          header.column
                            .id ===
                          'logo',
                        'sticky right-0 w-fit min-w-0 rounded-tl-[18px] bg-white shadow-md':
                          [
                            'organizationId',
                            'id',
                          ].includes(
                            header.id
                          ),
                        'min-w-60': [
                          'email',
                          'phone',
                        ].includes(
                          header.column
                            .id
                        ),
                        'm-auto ml-3 flex min-w-12 items-center justify-center':
                          header.id ==
                          'select',
                      }
                    )}
                  >
                    <div
                      className={`flex w-full items-center justify-between`}
                    >
                      {checkbox &&
                      header.id ===
                        'checked' ? (
                        <Checkbox
                          onCheckedChange={
                            onChecked
                          }
                        />
                      ) : (
                        <>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header
                                  .column
                                  .columnDef
                                  .header,
                                header.getContext()
                              )}
                          {![
                            'organizationId',
                            'id',
                            'select',
                          ].includes(
                            header.id
                          ) ? (
                            header.column.getIsSorted() ===
                            'asc' ? (
                              <ChevronUp />
                            ) : header.column.getIsSorted() ===
                              'desc' ? (
                              <ChevronDown />
                            ) : (
                              <ChevronsUpDown />
                            )
                          ) : null}
                        </>
                      )}
                    </div>
                  </TableHead>
                )
            )}
          </TableRow>
        ))}
    </TableHeader>
  )

  const renderTableBody = () => (
    <TableBody>
      {table
        .getRowModel()
        .rows.map((row, index) => (
          <TableRow
            key={row.id + index}
          >
            {row
              .getVisibleCells()
              .map((cell) =>
                hideColumns?.includes(
                  cell.column.id
                ) ? null : (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      'w-fit',
                      {
                        'min-w-none sticky right-0 bg-white shadow-md':
                          [
                            'organizationId',
                            'id',
                          ].includes(
                            cell.column
                              .id
                          ),
                      }
                    )}
                  >
                    {flexRender(
                      cell.column
                        .columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                )
              )}
          </TableRow>
        ))}
    </TableBody>
  )

  return (
    <>
      <div className='grid w-full gap-[0.625rem] border-0 lg:hidden'>
        {isLoading ? (
          skeletonElements.map(
            (_, index) => (
              <Fragment
                key={title + index}
              >
                <CardSkeleton />
              </Fragment>
            )
          )
        ) : (
          <div className='flex w-full flex-col items-start space-y-3'>
            {partnerData &&
              renderPartnerInfo()}
            {filterName ? (
              <FilterData
                filterName={
                  filterName + ''
                }
                data={data}
                filterFn={filterFn}
                filters={filter || []}
                transform={transform}
              />
            ) : (
              <div className='w-full space-y-3 rounded-lg'>
                {data.map(
                  (value, index) => (
                    <Fragment
                      key={
                        title + index
                      }
                    >
                      {transform(value)}
                    </Fragment>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {isLoading ? (
        <DataTableSkeleton
          columnCount={5}
          rowCount={4}
        />
      ) : (
        <div className='hidden gap-[0.625rem] lg:grid'>
          {partnerData && (
            <div className='flex items-center justify-between px-4'>
              <h1
                className={`${
                  hidden ? 'hidden' : ''
                } mt-[0.625rem] text-[1.375rem] font-normal text-lynch-400`}
              >
                {title}
              </h1>
              <div className='flex items-center gap-3'>
                {renderPartnerInfo()}
                {back && (
                  <CustomButton
                    className='ml-1 h-fit py-4 text-lynch-500'
                    label='Retour'
                    IconLeft={ArrowLeft}
                    variant='outline'
                    onClick={
                      handleBackClick
                    }
                  />
                )}
              </div>
            </div>
          )}
          {!partnerData &&
            title != '' && (
              <div
                className={`flex w-full items-center ${
                  !back
                    ? 'justify-between'
                    : 'justify-start'
                }`}
              >
                <h1 className='mt-[0.625rem] text-[1.375rem] font-normal text-lynch-400'>
                  {title}
                </h1>
                {!back && (
                  <CustomButton
                    className='ml-1 h-fit py-4 text-lynch-500'
                    label='Retour'
                    IconLeft={ArrowLeft}
                    variant='outline'
                    onClick={
                      handleBackClick
                    }
                  />
                )}
              </div>
            )}
          <div className='w-full overflow-auto rounded-[14px]'>
            <Table className='rounded-[14px] bg-white py-2'>
              {renderTableHeader()}
              {renderTableBody()}
            </Table>
          </div>
        </div>
      )}
    </>
  )
}
