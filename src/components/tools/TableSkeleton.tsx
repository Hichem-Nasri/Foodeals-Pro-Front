import { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton' // Ensure you have a Skeleton component

interface DataTableSkeletonProps {
  columnCount: number
  rowCount: number
}

export const DataTableSkeleton: FC<DataTableSkeletonProps> = ({
  columnCount,
  rowCount,
}) => {
  return (
    <div className='hidden w-full max-w-fit flex-col items-start justify-start gap-[1.2rem] overflow-auto rounded-[14px] lg:flex'>
      <Skeleton className='flex h-12 w-full items-center justify-start rounded-lg bg-white px-2 lg:w-60'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-56 rounded' />
        </div>
      </Skeleton>
      <Table className='w-full max-w-full overflow-auto rounded-[14px] bg-white py-2'>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columnCount }).map((_, index) => (
              <TableHead key={index} className={index === 0 ? 'w-48' : 'w-40'}>
                <Skeleton
                  className={`h-6 w-full rounded ${
                    index === 0 ? 'lg:w-full' : 'lg:w-40'
                  }`}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className={cellIndex === 0 ? 'w-48' : 'w-40'}
                >
                  <Skeleton
                    className={`h-4 w-full rounded-full ${
                      cellIndex === 0 ? 'lg:w-48' : 'lg:w-40'
                    }`}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
