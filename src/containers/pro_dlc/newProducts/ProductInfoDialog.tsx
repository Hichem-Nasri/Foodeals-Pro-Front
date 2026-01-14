import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ListFilter } from "lucide-react"
import { FC } from "react"
import { UseFormReturn } from "react-hook-form"
import AddProductFormDlc from "./AddProductForm"

interface ProductInfoDialogProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export const ProductInfoDialog: FC<ProductInfoDialogProps> = ({
    setOpen,
    open
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-white px-0 py-0 lg:top-1/2 lg:h-auto lg:min-h-fit lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:px-4 lg:py-4'
                showContent={false}
            >
                <AddProductFormDlc
                    setOpen={setOpen}
                    />
                    </DialogContent>
                </Dialog>
            )
}