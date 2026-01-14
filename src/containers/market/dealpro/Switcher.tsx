import { CustomButton } from '@/components/custom/CustomButton'
import { Filter, ListFilter } from 'lucide-react'
import React, { Fragment } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SwitcherProps {
  state: string
  setState: React.Dispatch<React.SetStateAction<'pending' | 'all' | 'valid'>>
  disabled: boolean
}

const Switcher: React.FC<SwitcherProps> = ({ state, setState, disabled }) => {
  const tabs = [
    { query: 'all', label: 'Tout' },
    { query: 'pending', label: 'En cours' },
    { query: 'valid', label: 'Livrée' }
  ]

  return (
    <motion.div 
      className='flex w-full flex-col items-center gap-4 py-4 lg:py-0'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex h-11 w-full min-w-fit items-center justify-evenly divide-x-2 divide-lynch-200 rounded-[18px] bg-white lg:h-12 lg:min-w-60 lg:justify-between lg:divide-x-0 lg:rounded-[11px] lg:bg-lynch-100 lg:bg-transparent lg:px-2.5 lg:py-2 gap-2'>
        {tabs.map((tab, index, arr) => {
          const isActive = state === tab.query
          return (
            <Fragment key={tab.label}>
              <motion.button
                disabled={disabled}
                className={cn(
                  'relative flex items-center justify-center z-10 w-full min-w-24 text-lg font-medium rounded-lg',
                  isActive && 'text-white z-10'
                )}
                type='button'
                onClick={() => setState(tab.query as 'pending' | 'all' | 'valid')}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="switcher-active-tab"
                    className={cn(
                      'absolute   h-12 w-full rounded-lg',
                      disabled ? 'bg-lynch-400' : 'bg-primary'
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      duration: 0.3
                    }}
                  />
                )}
                <span className={cn(
                  'relative z-10',
                  !isActive && 'text-lynch-400'
                )}>{tab.label}</span>
              </motion.button>
              {index < arr.length - 1 && (
                <span
                  key={`separ-${index}`}
                  className='block min-h-14 w-[0.5px] bg-lynch-300 lg:hidden'
                />
              )}
            </Fragment>
          )
        })}
      </div>
    </motion.div>
  )
}

export default Switcher
