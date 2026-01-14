'use client'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  MapPin,
  MessageCircleMore,
  PhoneCall,
  Timer,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function ScanQrCode() {
  const [open, setOpen] = useState(false)
  const [type] = useState<'client' | 'partner'>('partner')
  return (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
        <div className='flex items-center justify-between'>
          <AvatarAndName
            name='Marjane'
            avatar='/images/marjane_logo.png'
            subtitle='Supermarche'
            classNameAvatar='size-[46px]'
            classNameName='font-semibold text-base'
          />
          <div className='flex items-center gap-1.5'>
            <Button
              asChild
              className='flex size-14 items-center justify-center rounded-full p-0'
            >
              <Link href={'#'}>
                <PhoneCall />
              </Link>
            </Button>
            <Button
              asChild
              className='flex size-14 items-center justify-center rounded-full bg-amethyst-500 p-0 hover:bg-amethyst-500/80'
            >
              <Link href={'#'}>
                <MessageCircleMore />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className='bg-lynch-200' />
        <div className='flex justify-between text-sm'>
          <div className='flex flex-col gap-1'>
            <p className='text-lynch-900'>Fromage rouge Chedar</p>
            <p className='text-xs text-lynch-400'>
              Ceci est une description du produit...
            </p>
          </div>
          <div className='text-lynch-500'>x120</div>
        </div>
        <Separator className='bg-lynch-200' />
        <div className='flex justify-between text-sm font-medium text-lynch-500'>
          <div className='flex gap-2 text-sm font-medium'>
            <div className='flex items-center gap-1.5'>
              <CalendarDays size={16} />
              <span>12/09/2024</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Clock size={16} />
              <span>12h 20</span>
            </div>
          </div>
          <span className='text-[22px] font-semibold text-amethyst-500'>
            1 700 MAD
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-3 rounded-[30px] bg-white p-4 pt-[25px] text-lynch-950'>
        {/* Partner contact */}
        <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
          <div className='flex flex-col gap-2 text-sm font-medium text-lynch-500'>
            <h3 className='text-lynch-950'>Contact du partenaire</h3>
            <p>Amine Yassine</p>
          </div>
        </div>
        {/* partner */}
        <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
          <div className='flex text-sm font-medium text-lynch-500'>
            <div className='flex flex-1 flex-col gap-2'>
              <h3 className='text-lynch-950'>Date</h3>
              <div className='flex items-center gap-1.5'>
                <Calendar />
                <span>Tue, June 23</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <Timer />
                <span>10:00</span>
              </div>
            </div>
            <div className='flex flex-1 flex-col gap-2'>
              <h3 className='text-lynch-950'>Paiement par</h3>
              <div className='flex items-center gap-1.5'>
                <CreditCard />
                <span>Carte bancaire</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>Modalité de consommation</h3>
            <div className='flex items-center gap-2.5'>
              <Truck />
              <span>Livraison</span>
            </div>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>Adresse de livraison</h3>
            <div className='flex items-center gap-2.5'>
              <MapPin />
              <span>Résidence ain louh, bâchât lektif, fès</span>
            </div>
          </div>
        </div>
      </div>
      <DragButton
        handleConfirm={() => {
          setOpen(true)
          console.log('confirm') // redirect to the next page
        }}
        type={type}
      />
      {type == 'partner' ? (
        <SuccessDialog
          isOpen={open}
          setIsOpen={setOpen}
          content={
            'Recuperation a été effectuée avec succès.\n Merci pour votre excellent travail !'
          }
        />
      ) : (
        <SuccessDialog
          isOpen={open}
          setIsOpen={setOpen}
          content={`La livraison a été effectuée avec succès.\n Merci pour votre excellent travail !`}
        />
      )}
    </div>
  )
}

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useDragControls,
} from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { SuccessDialog } from '../../components/Dialogs'

const DragButton = ({
  handleConfirm,
  type,
}: {
  handleConfirm: () => void
  type: 'client' | 'partner'
}) => {
  const [isCompleted, setIsCompleted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const dragControls = useDragControls()
  const [maxDrag, setMaxDrag] = useState(0)
  const [showTruckMoving, setShowTruckMoving] = useState(false)

  // Calculate dimensions after render
  useEffect(() => {
    const updateDimensions = () => {
      if (buttonRef.current) {
        const buttonWidth = buttonRef.current.offsetWidth
        const calculatedMaxDrag = buttonWidth - 48 - 16 // 48px thumb, 16px padding
        setMaxDrag(calculatedMaxDrag)
        console.log('Max drag:', calculatedMaxDrag)
      }
    }

    // Wait for layout to complete
    setTimeout(updateDimensions, 0)
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Track x value changes in real-time to determine when to show the truck moving
  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      // Only start moving the truck when we're past 40% of the max drag
      const threshold = maxDrag * 0.4
      if (latest >= threshold && !showTruckMoving) {
        setShowTruckMoving(true)
      } else if (latest < threshold && showTruckMoving) {
        setShowTruckMoving(false)
      }
    })
    return () => unsubscribe()
  }, [x, maxDrag, showTruckMoving])

  const handleDragEnd = () => {
    const currentX = x.get()
    console.log('Drag ended at:', currentX)

    if (currentX > maxDrag * 0.5) {
      animate(x, maxDrag, {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }).then(() => {
        setIsCompleted(true)
        handleConfirm()
      })
    } else {
      animate(x, 0, { type: 'spring' }).then(() => {
        setShowTruckMoving(false)
      })
    }
  }

  // Calculate truck position based on drag position, but only after 40% threshold
  const truckX = useTransform(
    x,
    [maxDrag * 0.4, maxDrag],
    [0, maxDrag - maxDrag * 0.4]
  )

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative flex h-16 w-full items-center overflow-hidden rounded-full',
        'bg-amethyst-500 p-2 text-xl font-bold hover:bg-amethyst-500/90',
        { 'cursor-no-drop bg-mountain-400 hover:bg-mountain-400': isCompleted }
      )}
      disabled={isCompleted}
    >
      {/* Centered text - only visible when truck is not moving */}
      {!isCompleted && !showTruckMoving && (
        <div className='absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-white'>
          <Truck size={30} />
          <span>{type == 'partner' ? 'Recuprer' : 'Livree'}</span>
        </div>
      )}

      {/* Truck icon that moves with the drag after 40% threshold */}
      {!isCompleted && showTruckMoving && (
        <motion.div
          className='absolute text-white'
          style={{
            x: truckX,
            left: maxDrag * 0.4 + 60, // Position truck right after the button (button width + some spacing)
          }}
        >
          <Truck size={30} />
        </motion.div>
      )}

      {/* Draggable element with proper constraints */}
      <motion.div
        className='absolute left-2 top-2 z-20 h-12 w-12'
        style={{ x }}
        drag='x'
        dragControls={dragControls}
        dragConstraints={{ right: maxDrag }}
        dragElastic={0}
        onDragEnd={handleDragEnd}
        dragListener={!isCompleted}
      >
        <motion.span
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-white',
            'cursor-grab touch-none select-none shadow-[0_0_5px_2px_#000000FE] shadow-black/35 active:cursor-grabbing',
            { '!cursor-auto': isCompleted }
          )}
        >
          {isCompleted ? (
            <Check className='size-6 text-mountain-400' />
          ) : (
            <ArrowRight className='size-6 text-amethyst-500' />
          )}
        </motion.span>
      </motion.div>

      {/* Right-side checkmark */}
      {isCompleted && (
        <Check className='ml-auto mr-2 size-6 text-mountain-400' />
      )}
    </motion.button>
  )
}
