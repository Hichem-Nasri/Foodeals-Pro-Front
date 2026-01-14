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

export default function PreviewProductCarousel({
  images,
  color = 'purple',
}: {
  images: string[]
  color?: ColorsT
}) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

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

  return (
    <div className='w-full'>
      <Carousel
        className='w-full overflow-hidden rounded-2xl max-[500px]:max-w-96 max-[420px]:max-w-[300px]'
        // className='w-full overflow-hidden rounded-2xl'
        setApi={setApi}
      >
        <CarouselContent>
          {images.map((imgSrc, index) => (
            <CarouselItem
              key={index}
              // className='basis-full lg:basis-1/2 xl:basis-1/3'
              className='basis-full'
            >
              <div className='p-1'>
                <div className='relative flex aspect-[33/25] items-center justify-center overflow-hidden rounded-2xl p-6'>
                  <Image src={imgSrc} fill className='object-cover' alt={''} />
                </div>
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
