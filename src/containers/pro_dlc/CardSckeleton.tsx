import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const ProductCardDlcSkeleton = () => (
    <div
        className={cn(
            `relative flex h-auto min-w-full max-w-[400px] flex-col gap-3 rounded-[20px] border-2 border-mountain-400 bg-white p-6`
        )}
    >
        <div className='flex h-full w-full'>
            {/* Left side - Main content */}
            <div className='flex flex-1 flex-col'>
                <div className='flex items-start justify-start space-x-2 justify-self-start'>
                    <Skeleton className='h-[46px] w-[46px] rounded-full border border-lynch-100' />
                    <div className='flex flex-col'>
                        <Skeleton className='mb-1 h-[17px] w-[100px]' />
                        <Skeleton className='mb-2 h-[15px] w-[80px]' />
                        <div className='mt-2 flex items-center space-x-1.5'>
                            <Skeleton className='h-[18px] w-[18px] rounded-full' />
                            <Skeleton className='h-[14px] w-[100px]' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Status elements */}
            <div className='ml-4 flex flex-col items-end gap-2'>
                <Skeleton className='h-[30px] w-[74px] rounded-full' />
                <Skeleton className='h-[17px] w-[30px]' />
            </div>
        </div>
    </div>
)

export default ProductCardDlcSkeleton
