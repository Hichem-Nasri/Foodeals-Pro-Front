import { Label } from '@/components/custom/Label'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { X } from 'lucide-react'
import React from 'react'

interface SearchCollaboratorProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  placeholder?: string
}

const SearchCollaborator: React.FC<SearchCollaboratorProps> = ({
  setSearch,
  search,
  placeholder = 'Rechercher',
}) => {
  return (
    <div className='relative flex h-fit w-full flex-col items-start justify-between gap-3'>
      <Label label='Rechercher' className='text-sm font-semibold' />

      <Command className='rounded-[12px relative'>
        <CommandInput
          placeholder={placeholder}
          onValueChange={(e) => setSearch(e)}
          className='h-14 w-full min-w-full bg-lynch-50 text-base font-normal text-lynch-400 placeholder:text-lynch-400'
          value={search}
        />
        <CommandList></CommandList>
        <span>
          <X
            className='icon absolute right-2 top-1 shrink-0 translate-y-1/2 cursor-pointer text-lynch-300'
            onClick={() => setSearch('')}
          />
        </span>
      </Command>
    </div>
  )
}

export default SearchCollaborator
