import { CustomButton } from '@/components/custom/CustomButton'
import { InputFieldForm } from '@/components/custom/InputField'
import { Label } from '@/components/custom/Label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { ArchiveSchema } from '@/schemas/global-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Archive, X } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Archiver = ({
  asChild = false,
  onSubmit,
  title,
  isPending,
  opened,
  setOpened,
}: {
  asChild?: boolean
  onSubmit: any
  title: string
  isPending?: boolean
  opened?: boolean
  setOpened?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [open, setOpen] = React.useState(opened)
  const form = useForm({
    resolver: zodResolver(ArchiveSchema),
    mode: 'onBlur',
    defaultValues: {
      motif: '',
      raison: '',
    },
  })

  const { handleSubmit, formState } = form
  const { isDirty, isValid } = formState

  const handleFormSubmit = (data: any) => {
    if (isValid) {
      onSubmit(data)
      setOpen(false)
    }
  }

  return (
    <Dialog
      open={opened ?? open}
      onOpenChange={(open) => {
        if (setOpened) setOpened(open)
        else setOpen(open)
      }}
    >
      {asChild && (
        <DialogTrigger className='w-full lg:w-fit'>
          <CustomButton
            label='Archive'
            size='sm'
            variant='default'
            onClick={() => setOpen(true)}
            className='w-full border border-coral-500 bg-coral-50 text-center text-coral-500 transition-all delay-75 duration-100 hover:bg-coral-500 hover:text-coral-50'
            IconRight={Archive}
            disabled={isPending}
          />
        </DialogTrigger>
      )}
      <DialogContent className='rounded-2xl p-4' showContent={false}>
        <DialogTitle className='flex w-full items-center justify-between text-lynch-400'>
          <h1 className='text-xl font-normal'>{title}</h1>
          <DialogClose>
            <X className='h-6 w-6' />
          </DialogClose>
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='flex flex-col gap-4'>
              <InputFieldForm
                label='Motif'
                control={form.control}
                name='motif'
                type='text'
                placeholder='Saisissez le motif'
              />
              <FormField
                name='raison'
                control={form.control}
                render={({ field }) => (
                  <div className='flex flex-col gap-1'>
                    <Label label='Raison' className='text-sm font-semibold' />
                    <Textarea
                      {...field}
                      placeholder='Saisissez la raison'
                      className='max-h-min min-h-36 w-full text-base text-lynch-400'
                      rows={400}
                      cols={400}
                    />
                  </div>
                )}
              />
              <div className='flex gap-4'>
                <DialogClose className='w-full'>
                  <CustomButton
                    label='Annuler'
                    size='sm'
                    className='w-full border border-coral-500 bg-coral-50 text-center text-coral-500 transition-all delay-75 duration-100 hover:bg-coral-500 hover:text-coral-50'
                  />
                </DialogClose>
                <CustomButton
                  label='Confirmer'
                  size='sm'
                  type='submit'
                  className='w-full bg-primary text-white'
                  disabled={isPending || !isDirty || !isValid}
                />
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default Archiver
