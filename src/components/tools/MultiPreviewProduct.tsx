import Image from 'next/image'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel'
import { cn } from '@/lib/utils'
import React from 'react'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { Check } from 'lucide-react'
import { SupplementType } from '@/types/market-pro-type'

export default function MultiPreviewProduct({
  images,
  color = 'green',
  setSelected,
}: {
  images: SupplementType[]
  color?: ColorsT
  setSelected: React.Dispatch<React.SetStateAction<SupplementType[]>>
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [items, setItems] = React.useState<Set<number>>(new Set())

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  React.useEffect(() => {
    setSelected(
      images.filter((_, index) => {
        return items.has(index)
      })
    )
  }, [items])
  return (
    <div className='w-full'>
      <Carousel
        className='w-full overflow-hidden rounded-2xl max-[500px]:max-w-96 max-[420px]:max-w-[300px]'
        setApi={setApi}
      >
        <CarouselContent>
          {images.map(({ image, name, price }, index) => (
            <CarouselItem
              key={index}
              // className='basis-full lg:basis-1/2 xl:basis-1/3'
              className={`col-span-1 flex w-full basis-1/3 flex-col items-center gap-3 lg:basis-1/5 xl:basis-1/6`}
            >
              <h1>{name}</h1>
              <button
                type='button'
                title={items.has(index) ? 'Supprimer' : 'Ajouter'}
                className='relative aspect-square w-full cursor-pointer rounded-[14px] bg-lynch-300 p-2'
                onClick={() => {
                  if (items.has(index)) {
                    setItems((prev) => {
                      const newItems = new Set(prev)
                      newItems.delete(index)
                      return newItems
                    })
                  } else {
                    setItems((prev) => new Set(prev.add(index)))
                  }
                }}
              >
                {items.has(index) && (
                  <div className='absolute left-0 top-0 z-50 size-8 rounded-full border bg-primary text-white flex-center'>
                    <Check size={24} />
                  </div>
                )}
                <Image
                  src={image as string}
                  fill
                  className='aspect-square w-full rounded-[14px] object-cover'
                  alt={''}
                />
              </button>
              <div className='h-12 w-full rounded-[12px] bg-lynch-50 text-lynch-400 flex-center'>
                {price}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className='flex justify-center gap-[9px] pt-4'>
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'size-[13px] rounded-full transition-colors',
              current === index
                ? getActiveColorClassName(color, 'bg')
                : 'bg-lynch-200'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
