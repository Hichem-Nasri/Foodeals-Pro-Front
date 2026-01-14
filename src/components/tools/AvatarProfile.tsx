import { Label } from '../custom/Label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ImageUp } from 'lucide-react'
import { IconType } from '@/types/common-types'

interface AvatarProfileProps {
  iUrl: string
  alt?: string
  label?: string
  className?: string
  disabled?: boolean
  onChange?: (file: File | null) => void // Change to accept a File
  isLoaded?: boolean
  Icon?: React.ReactNode
  textEmpty?: string
  useEmpty?: boolean
}

export const AvatarProfile: React.FC<AvatarProfileProps> = ({
  alt = '',
  iUrl,
  label = '',
  className,
  disabled,
  onChange,
  isLoaded = false,
  Icon,
  textEmpty = 'Photo du couverture',
  useEmpty = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [src, setSrc] = useState(iUrl)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const selectedFile = e.currentTarget.files[0]
      if (!useEmpty) setSrc(URL.createObjectURL(selectedFile))
      if (onChange) onChange(selectedFile) // Send the file to the parent component
    } else {
      setSrc(iUrl)
      if (onChange) onChange(null) // Send null to the parent component
    }
  }
  useEffect(() => {
    if (iUrl == '') setSrc('')
  }, [iUrl])
  return (
    <div className='flex w-full flex-col gap-3 text-center'>
      {label.length > 0 && (
        <Label
          label={label}
          className='hidden text-xs font-semibold text-lynch-950 lg:inline'
        />
      )}
      <Avatar
        className={cn(
          `h-[7.5rem] w-[7.5rem] cursor-pointer border lg:rounded-[24px] ${
            src ? 'border-lynch-200' : 'border-2 border-lynch-200'
          }`,
          className
        )}
        onClick={() => inputRef.current?.click()}
      >
        {isLoaded ? (
          <Skeleton className='h-full w-full rounded-[24px]' />
        ) : (
          <>
            <Input
              ref={inputRef}
              type='file'
              disabled={disabled}
              className='pointer-events-none absolute left-0 top-0 h-full w-full opacity-0 disabled:cursor-default'
              onChange={handleFileChange} // Update to use the new function
            />
            {src ? (
              <>
                <AvatarImage
                  src={src || '/emptyImage.svg'}
                  className={`object-cover ${!src && 'm-auto w-[20%]'} `}
                />
                <AvatarFallback>{alt && alt[0].toUpperCase()}</AvatarFallback>
              </>
            ) : (
              <div
                className={cn(
                  'flex h-full w-full flex-col items-center justify-center space-y-2 rounded-[24px] bg-lynch-50 text-lynch-200',
                  className,
                  'border-none'
                )}
              >
                {Icon ? Icon : <ImageUp className='w-full' size={56} />}
                {(alt == 'cover' || textEmpty != 'Photo du couverture') && (
                  <Label
                    label={textEmpty}
                    className='flex text-[14px] font-[17.07px] text-lynch-300 lg:hidden'
                  />
                )}
              </div>
            )}
          </>
        )}
      </Avatar>
    </div>
  )
}
