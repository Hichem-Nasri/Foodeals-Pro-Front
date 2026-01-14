'use client'
import { PartnerSolutionType } from '@/types/GlobalType'
import React, { FC } from 'react'
import { PartnerSolution } from './PartnerSolution'
import { useSolutions } from '@/context/SolutionContext'
import {
  usePathname,
  useRouter,
} from 'next/navigation'
import { Salad } from 'lucide-react'

interface MySolutionsProps {
  solutions?: PartnerSolutionType[]
}

const MySolutions: FC<
  MySolutionsProps
> = ({
  solutions = [
    'gestion_solutions',
    'pro_dlc',
    'pro_market',
    'pro_donate',
  ], // TODO: change this to the actual solutions
}) => {
  const router = useRouter()
  const {
    solution: mySolution,
    ChangeSolution,
  } = useSolutions()

  return (
    <div className='my-12 flex flex-col items-start justify-center gap-4 px-2 lg:hidden'>
      <div className='text-2xl text-lynch-950'>
        Mes Solutions
      </div>
      <div className='flex flex-wrap items-center justify-start gap-2'>
        {solutions.map(
          (solution, index) => (
            <PartnerSolution
              key={index}
              size={18}
              solution={
                solution as PartnerSolutionType
              }
              className={`cursor-pointer ${mySolution.solution == solution && 'border-[2px]'}`}
              classNameSolution='bg-lynch-100 text-lynch-500 border-lynch-500'
              emptySolutionName='Gestion des solutions'
              Icon={Salad}
              onClick={() => {
                ChangeSolution(
                  solution as PartnerSolutionType
                )
                let route = ''
                switch (solution) {
                  case 'pro_dlc':
                    route = '/pro-dlc'
                    break
                  case 'pro_market':
                    route =
                      '/pro-market'
                    break
                  case 'pro_donate':
                    route =
                      '/pro-donate'
                    break
                  case 'gestion_solutions':
                    route = '/'
                    break
                }
                router.push(route)
                //! add logic to change solution
              }}
            />
          )
        )}
      </div>
    </div>
  )
}

export default MySolutions
