import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { capitalize } from '@/utils/utils'
import React, { FC } from 'react'

interface FilterDataProps<T> {
  filterName: keyof T // The name of the property to filter by
  data: T[] // The array of data to filter
  filters: string[] // The array of filter values
  filterFn?: (item: T, filterValue: string) => boolean // Optional custom filter function
  transform?: (item: T) => React.ReactNode // Optional transform function for rendering
}

const FilterData: FC<FilterDataProps<any>> = ({
  filterName,
  data,
  filters,
  filterFn,
  transform,
}) => {
  const filterItems =
    filters && filters.length > 0
      ? filters
      : [...new Set(data.map((item) => item[filterName]))]
  // Create an array to hold filtered results
  const filteredData = filterItems.map((filterValue) => {
    return data.filter((item) => {
      if (filterFn) {
        return filterFn(item, filterValue) // Use custom filter function if provided
      } else {
        // Default filtering logic (assuming filter values are numbers)
        return item[filterName] === filterValue
      }
    })
  })

  return (
    <div className='flex w-full flex-col gap-4'>
      {filteredData
        .filter((group) => group.length)
        .map((group, index) => (
          <Accordion
            type='single'
            collapsible
            defaultValue='Product'
            key={index}
            className='px-2'
            title={`Filter: ${filterItems[index]}`}
          >
            <AccordionItem
              value='Product'
              className='flex flex-col gap-1 text-[1.375rem] font-normal text-lynch-400'
            >
              <AccordionTrigger className='flex items-center justify-between gap-2 py-0 text-[1.375rem] font-normal'>
                <h1 className='w-fit text-nowrap py-3'>
                  {capitalize(filterItems[index])}
                </h1>
                <hr className='h-[0.55px] w-full bg-lynch-200' />
              </AccordionTrigger>
              {group.length > 0 &&
                group.map((item, itemIndex) => (
                  <AccordionContent className='pt-3' key={itemIndex}>
                    {transform ? (
                      transform(item)
                    ) : (
                      <span>{JSON.stringify(item)}</span>
                    )}
                  </AccordionContent>
                ))}
            </AccordionItem>
          </Accordion>
        ))}
    </div>
  )
}

export default FilterData
