import IconAndText from '@/app/[locale]/pro-market/components/IconAndText'
import { CustomButton } from '@/components/custom/CustomButton'
import { Input } from '@/components/custom/Input'
import { Label } from '@/components/custom/Label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import TitleDevider from '@/components/utils/TitleDevider'
import { BasketItem } from '@/types/market-pro-type'
import { Calendar, Clock, PenLine, Trash, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useBasketTranslations } from '@/hooks/useTranslations'

interface BacketCardProps {
  DeleteItem: () => void
  Item: BasketItem
  id: number
  setItems: React.Dispatch<React.SetStateAction<BasketItem[]>>
}

const deleteProduct = (
  i: number,
  j: number,
  setItems: React.Dispatch<React.SetStateAction<BasketItem[]>>,
  Item: BasketItem
) => {
  const newOrder = { ...Item }
  let tmp = Array.from(Item.orders)
  const deleted = tmp.find((_, index) => index === j)
  if (deleted) {
    newOrder.price -= deleted.price
    newOrder.Store.products -= deleted.quantity // TODO: check if this is correct
    newOrder.orders = tmp.filter((_, index) => index !== j)
    setItems((prev) => {
      const temp = Array.from(prev)
      if (newOrder.orders.length === 0) {
        return temp.filter((_, index) => index !== i)
      }
      temp[i] = newOrder
      return temp
    })
  }
}

const ChangeQuantity = (
  index: number,
  setItems: React.Dispatch<React.SetStateAction<BasketItem[]>>,
  Item: BasketItem,
  quantity: number
) => {
  const temp = { ...Item }
  const tmp = temp.orders
  tmp[index].quantity = quantity
  temp.orders = tmp
  setItems((prev) => {
    const newitem = Array.from(prev)
    newitem[index] = temp
    return newitem
  })
}

const BacketCard: React.FC<BacketCardProps> = ({
  DeleteItem,
  Item,
  id,
  setItems,
}) => {
  const bt = useBasketTranslations()
  const [Readonly, setReadonly] = React.useState(
    Array(Item.orders.length).fill(true)
  )
  console.log(Readonly)
  return (
    <Accordion type='single' collapsible className='w-full' key={id}>
      <AccordionItem
        value={`${id}-item-1`}
        className='flex w-full flex-col gap-2 rounded-[30px] bg-white p-4 lg:divide-y-0'
      >
        <AccordionTrigger
          onClick={() => {
            console.log('Accordion is Clicked')
          }}
          classNameArrow='text-lynch-300 size-8'
          className=''
        >
          <AvatarAndRole
            avatar={'/images/' + Item.Store.image}
            role={Item.Store.products + ' ' + bt('card.products')}
            name={Item.Store.name}
            className='font-normal text-lynch-400'
            classNameName='text-mountain-400'
            classNameRole='text-lynch-400'
          />
        </AccordionTrigger>
        <Separator className='h-[0.5px] bg-lynch-200' />
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-3 text-sm'>
            {/* TODO: add the exacet date */}
            <IconAndText
              IconLeft={Calendar}
              text={new Date(Item.date).toLocaleDateString()}
              size={16}
            />
            <IconAndText
              IconLeft={Clock}
              text={new Date(Item.date)
                .toLocaleTimeString()
                .split(':')
                .slice(0, 2)
                .join('h:')}
              size={16}
            />
          </div>
          <div className='gap-2 flex-center'>
            <p className='text-lg font-semibold text-primary'>
              {Item.price} Mad
            </p>
            <CustomButton
              label=''
              variant='ghost'
              size='sm'
              IconLeft={Trash2}
              className='bg-transparent p-0 text-coral-500 hover:bg-transparent'
              onClick={DeleteItem}
            />
          </div>
        </div>
        <AccordionContent className='flex flex-col gap-3'>
          {Item.orders.map((order, index) => (
            <>
              <Separator className='h-[0.5px] bg-lynch-200' />
              <div className='flex items-center justify-start gap-3'>
                <Image
                  src={`/images/${order.image}`}
                  alt={order.name}
                  className='rounded-[12px] bg-lynch-100 object-cover'
                  width={86}
                  height={75}
                  layout='fixed'
                  loading='lazy'
                />
                <div className='flex flex-col items-start justify-center gap-1'>
                  <h1 className='text-lg font-semibold text-lynch-950'>
                    {order.name}
                  </h1>
                  <p className='line-clamp-2 text-sm text-lynch-400'>
                    {order.description}
                  </p>
                </div>
              </div>
              <Separator className='h-[0.5px] bg-lynch-200' />
              <div className='grid grid-cols-3 gap-1'>
                <Input
                  label={bt('card.quantity')}
                  type='number'
                  placeholder=''
                  className='flex w-full items-center text-center text-lynch-500'
                  onChange={(e) => {
                    if (e === '' || +e < 1) {
                      return
                    }
                    ChangeQuantity(index, setItems, Item, +e)
                  }}
                  value={order.quantity}
                  name={''}
                  disabled={Readonly[index]}
                />
                <div className='flex w-full flex-col items-center gap-3'>
                  <Label label={bt('card.price')} className='text-sm' />
                  <div className='gap-3 self-center py-2 flex-center'>
                    <p className='self-center justify-self-center py-2 text-lg font-semibold text-mountain-500'>
                      {order.price} Mad
                    </p>
                  </div>
                </div>
                <div className='flex w-full flex-col items-center gap-3'>
                  <Label label={bt('card.modify')} className='text-sm' />
                  <div className='item-center flex h-full w-full justify-center gap-1 self-center'>
                    <CustomButton
                      label=''
                      variant='ghost'
                      size='sm'
                      IconLeft={Trash2}
                      className='self-center bg-transparent p-0 text-coral-500 hover:bg-transparent'
                      onClick={() => {
                        deleteProduct(id, index, setItems, Item)
                      }}
                    />
                    <CustomButton
                      label=''
                      variant='ghost'
                      size='sm'
                      IconLeft={Readonly[index] ? PenLine : X}
                      className='self-center bg-transparent p-0 text-lynch-400 hover:bg-transparent'
                      onClick={() => {
                        setReadonly((prev) => {
                          const temp = Array.from(prev)
                          temp[index] = !temp[index]
                          return temp
                        })
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default BacketCard
