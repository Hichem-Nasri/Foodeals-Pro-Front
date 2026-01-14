'use client'
import React from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
} from '../ui/dialog'
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { CustomButton } from '../custom/CustomButton'
import { HelpingHand, Send, X } from 'lucide-react'
import MobileHeader from '../custom/MobileHeader'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as XLSX from 'xlsx' // For Excel file generation
import { Form, FormField, FormItem, FormMessage } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { InputFieldForm } from '../custom/InputField'
import { Textarea } from '../ui/textarea'
import { Label } from '../custom/Label'
import { UploadFile } from '../utils/UploadFile'

interface MySupportProps {}

const MySupport: React.FC<MySupportProps> = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton
          className='absolute bottom-4 left-2 rounded-full border-2 border-white bg-neutral-950 p-4 text-white transition-all hover:bg-white hover:text-neutral-950 [&>.icon]:m-0'
          label={''}
          IconLeft={HelpingHand}
        />
      </DialogTrigger>
      <DialogContent
        className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-lynch-50 px-0 py-0 lg:top-1/2 lg:h-[90%] lg:min-h-fit lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:bg-white lg:p-4'
        showContent={false}
      >
        <DialogTitle className='hidden w-full justify-between text-lg font-semibold text-lynch-500 lg:flex'>
          Bug Reporting
          <DialogClose>
            <X size={24} />
          </DialogClose>
        </DialogTitle>
        <MobileHeader
          title='Bug Reporting'
          onClick={() => {}}
          buttonType='dialog'
        />
        <DialogDescription className='flex flex-col gap-3'>
          <SupportForm />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

// Define the type for the form data
type FormData = {
  title: string
  description: string
  attachment: FileList | null
}

// Define the type for a support request

const SupportRequestSchema = z.object({
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().min(1, 'La description est obligatoire'),
  attachment: z.union([z.string(), z.instanceof(File)]).nullable(),
})

type SupportRequest = z.infer<typeof SupportRequestSchema>

function SupportForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(SupportRequestSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      attachment: null,
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [message, setMessage] = useState<string>('')

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { title, description, attachment } = data

    // Convert attachment to Base64 (if provided)
    let attachmentBase64 = null
    if (attachment && attachment.length > 0) {
      attachmentBase64 = await toBase64(attachment[0])
    }

    // Create a new support request
    const newRequest: SupportRequest = {
      title,
      description,
      attachment: attachmentBase64,
    }

    // Add the new request to the list
    setRequests([...requests, newRequest])
    handleDownload()
    convertToExcel(requests)
    reset() // Reset the form
    setMessage('Support request added successfully!')
  }

  // Convert file to Base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })

  // Handle downloading all requests as a file
  const handleDownload = () => {
    // Convert requests to JSON or Excel
    const data = JSON.stringify(requests, null, 2) // For JSON
    // const data = convertToExcel(requests); // For Excel

    // Create a Blob and download it
    const blob = new Blob([data], { type: 'application/json' }) // For JSON
    // const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }); // For Excel
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'support-requests.json' // For JSON
    // link.download = "support-requests.xlsx"; // For Excel
    link.click()
    URL.revokeObjectURL(url)
  }

  // Convert requests to Excel (optional)
  const convertToExcel = (requests: SupportRequest[]) => {
    const worksheet = XLSX.utils.json_to_sheet(requests)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Support Requests')
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <InputFieldForm
          control={form.control}
          name='title'
          label='Titre'
          placeholder='Titre'
          disabled={false}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <div className='flex flex-col gap-3'>
              <Label label='Description' />
              <Textarea
                {...field}
                placeholder='Description'
                disabled={false}
                className='h-32 w-full rounded-[8px] p-4 text-base text-lynch-400 disabled:cursor-text disabled:opacity-100'
                onChange={(e) => field.onChange(e.target.value)}
                value={field.value}
              />
              <FormMessage {...field} />
            </div>
          )}
        />
        <FormField
          render={({ field }) => {
            return (
              <FormItem className='flex w-full flex-col items-start'>
                <Label label='Pièce jointe (Optionnelle)' />
                <UploadFile
                  onChange={(e) => {
                    console.log('e: ', e)
                    if (e && e.length > 0) field.onChange(e[0])
                    else field.onChange(null)
                  }}
                  multiSelect={false}
                />
                <FormMessage {...field} />
              </FormItem>
            )
          }}
          name={'attachment'}
        />
        <CustomButton
          type='submit'
          label='Envoyer'
          size={'sm'}
          IconLeft={Send}
          className='w-fit self-end border-2 border-white hover:border-primary hover:bg-white hover:text-primary'
        />
      </form>
    </Form>
  )
}

export default MySupport
