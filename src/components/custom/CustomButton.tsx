import { Button } from '@/components/ui/button'
import {
  Loader,
  LucideProps,
} from 'lucide-react'
import {
  ForwardRefExoticComponent,
  JSX,
  RefAttributes,
} from 'react'

interface CustomButtonProps {
  label: string
  IconLeft?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  IconRight?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  onClick?: () => void
  disabled?: boolean
  className?: string
  size?:
    | 'default'
    | 'sm'
    | 'lg'
    | 'icon'
    | null
    | undefined
  type?: 'button' | 'submit' | 'reset'
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  title?: string
  refText?: React.RefObject<HTMLDivElement>
  isPending?: boolean
  id?: string
}

export const CustomButton: React.FC<
  CustomButtonProps
> = ({
  label,
  IconLeft,
  IconRight,
  isPending,
  refText,
  type = 'button',
  ...rest
}): JSX.Element => {
  return (
    <Button {...rest} type={type}>
      {IconLeft && (
        <IconLeft className='icon rtl:ml-2 rtl:mr-0 mr-2 shrink-0' />
      )}
      {isPending ? (
        <div>
          <Loader className='icon rtl:ml-2 rtl:mr-0 mr-2 shrink-0 animate-spin' />
        </div>
      ) : (
        <span
          ref={refText}
          className='label peer z-0'
        >
          {label}
        </span>
      )}
      {IconRight && (
        <IconRight className='icon rtl:mr-2 rtl:ml-0 ml-2 shrink-0' />
      )}
    </Button>
  )
}
