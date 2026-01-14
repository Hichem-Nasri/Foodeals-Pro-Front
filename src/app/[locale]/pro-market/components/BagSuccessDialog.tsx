import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { IoBagCheck } from 'react-icons/io5'

export function BagSuccessDialog({
  isOpen = false,
  content,
}: {
  isOpen?: boolean
  content: string
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className='max-w-[362px] rounded-[30px] p-0 shadow-none sm:rounded-[30px]'
        showContent={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{content}</DialogTitle>
        </VisuallyHidden.Root>
        <div className='flex h-[274px] flex-col items-center justify-center gap-4 p-4 pt-6 text-center'>
          <DialogDescription className='whitespace-pre-wrap text-lg font-semibold text-lynch-900'>
            {content}
          </DialogDescription>
          <IoBagCheck size={110} className='text-mountain-500' />
        </div>
      </DialogContent>
    </Dialog>
  )
}
