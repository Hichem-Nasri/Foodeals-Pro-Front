import { Input } from '@/components/custom/Input'
import { CloudUpload, FileMinus, LucideProps, X } from 'lucide-react'
import React, {
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useEffect,
  useState,
} from 'react'

interface UploadFileProps {
  value?: File[]
  onChange?: (files: File[]) => void
  disabled?: boolean
  placeholder?: string
  multiSelect?: boolean
  Icon?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  extensions?: string
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedFile?: React.Dispatch<React.SetStateAction<File | null>>
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

export const UploadFile: FC<UploadFileProps> = ({
  disabled,
  onChange,
  value = [],
  placeholder = 'Charger le contrat',
  multiSelect = false,
  Icon = FileMinus,
  extensions = '',
  open,
  setOpen,
  setSelectedFile,
}) => {
  const [files, setFiles] = useState<File[]>(value || [])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      console.log('File input changed') // Log to check if this is called
      if (selectedFiles && selectedFiles.length > 0) {
        const newFilesArray = Array.from(selectedFiles)
        const validFiles = newFilesArray.filter((file) => {
          if (file.size > MAX_FILE_SIZE) {
            setError(`File ${file.name} exceeds the maximum size of 2 MB.`)
            return false // Exclude this file
          }
          setError(null)
          return true // Include this file
        })

        const updatedFiles = files.filter(
          (file) => !validFiles.some((newFile) => newFile.name === file.name)
        )
        const combinedFiles = [...updatedFiles, ...validFiles]
        if (onChange) {
          onChange(combinedFiles)
        }
        setFiles(combinedFiles)
      }
    },
    [files]
  )

  const handleRemoveFile = useCallback(
    (fileToRemove: File) => {
      setFiles((prev) => {
        const updatedFiles = prev.filter(
          (file) => file.name !== fileToRemove.name
        )
        if (onChange) {
          onChange(updatedFiles)
        }
        return updatedFiles
      })
    },
    [onChange]
  )

  return (
    <div className='flex w-full flex-col justify-start gap-1'>
      <div className='relative flex w-full'>
        <Input
          className='text-opacity-0 disabled:cursor-not-allowed disabled:opacity-50'
          name='file'
          disabled={disabled}
          value={''} // Keep this empty as it's a file input
          IconRight={CloudUpload}
          placeholder={files.length > 0 ? '' : placeholder}
          label=''
          onChange={() => {}} // Do nothing
        />
        <input
          type='file'
          className='absolute left-0 top-0 h-full w-full cursor-pointer text-opacity-0 opacity-0 disabled:cursor-not-allowed'
          onChange={handleFileChange} // Use the correct handler here
          disabled={disabled}
          multiple={multiSelect}
          accept={extensions}
          aria-label='Upload files'
        />
        <div className='absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-3'>
          {files.map((file) => (
            <FileItem
              key={file.name}
              file={file}
              onRemove={handleRemoveFile}
              setSelectedFile={setSelectedFile}
              setOpen={setOpen}
              Icon={Icon}
            />
          ))}
        </div>
      </div>
      {error && (
        <div className='error-message text-coral-300'>
          {'! '}
          {error}
        </div>
      )}
    </div>
  )
}

const FileItem: FC<FileItemProps> = ({
  file,
  onRemove,
  setSelectedFile,
  setOpen,
  Icon,
}) => (
  <div className='z-20 flex w-full items-center justify-between rounded-[100px] bg-lynch-200 px-1 py-[0.4rem] font-semibold text-lynch-500'>
    <button
      type='button'
      title={`Open ${file.name}`}
      onClick={() => {
        setSelectedFile && setSelectedFile(file)
        setOpen && setOpen(true)
      }}
      className='flex items-center justify-center space-x-1.5 px-3'
    >
      <Icon className='size-4 font-semibold' />
      <span>{file.name}</span>
    </button>
    <X
      className='size-5 cursor-pointer font-semibold'
      onClick={() => onRemove(file)}
    />
  </div>
)

interface FileItemProps {
  file: File
  onRemove: (file: File) => void
  setSelectedFile?: React.Dispatch<React.SetStateAction<File | null>>
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
}
