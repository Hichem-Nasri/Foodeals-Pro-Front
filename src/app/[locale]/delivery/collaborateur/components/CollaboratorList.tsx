'use client'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import TitleDevider from '@/components/utils/TitleDevider'
import { AccordionItem } from '@radix-ui/react-accordion'
import { ListFilter, ListPlus, Mail, PhoneCall, UserPlus } from 'lucide-react'
import Link from 'next/link'
import MobileListRow from '../../components/MobileListRow'
import { collaboratorQueries } from '@/hooks/delivery/queries/collaborator-queries'
import { roleFrenchName } from '@/types/GlobalType'
import { useDeliveryTranslations, useCommonTranslations } from '@/hooks/useTranslations'

export default function CollaboratorList() {
  const t = useDeliveryTranslations()
  const tCommon = useCommonTranslations()
  
  // TODO: The id should be dynamic
  // ? very important
  // ? this is just a placeholder

  const { data, error, isLoading } =
    collaboratorQueries.useGetAllCollaborators()

  console.log(data)
  if (isLoading) {
    return <pre>{tCommon('loading')}</pre>
  }
  if (error) {
    return <pre>{error.message}</pre>
  }
  if (!error && !isLoading && data)
    return (
      <div className='px-2'>
        <div className='flex justify-between'>
          <h2 className='flex items-center gap-3 text-[22px] font-medium'>
            {t('navigation.collaborators')}
          </h2>
          <div className='flex gap-3'>
            <Button className='size-14 rounded-full bg-white p-0 text-lynch-400 hover:bg-lynch-100 hover:text-lynch-500'>
              <ListFilter className='text-lynch-400' />
            </Button>
          </div>
        </div>
        {data.map((item) => (
          <Accordion
            type='single'
            collapsible
            className='w-full'
            key={item.category}
            defaultValue={`${item.category}-item-1`}
          >
            <AccordionItem value={`${item.category}-item-1`}>
              <AccordionTrigger classNameArrow='text-lynch-300 size-6'>
                <TitleDevider
                  position='left'
                  title={item.category}
                  className='font-normal text-lynch-400'
                />
              </AccordionTrigger>
              <AccordionContent>
                <div className='flex flex-col gap-3'>
                  {item.members.map((member) => (
                    <MobileListRow
                      key={member.id}
                      name={`${member.name.firstName} ${member.name.lastName}`}
                      classNameSubtitle='capitalize'
                      avatarSubtitle={roleFrenchName[member.role]}
                      buttons={[
                        {
                          type: 'Link',
                          Icon: PhoneCall,
                          href: `tel:${member.phone}`,
                        },
                        {
                          type: 'Link',
                          Icon: Mail,
                          href: `mailto:${member.email}`,
                        },
                        {
                          type: 'Link',
                          Icon: ListPlus,
                          href: `/delivery/collaborateur/${member.id}`,
                        },
                      ]}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
        <Button
          className='my-5 flex w-full items-center gap-3 text-sm uppercase'
          asChild
        >
          <Link href='/delivery/collaborateur/new'>
            <span>{t('collaborators.addUser')}</span>
            <UserPlus />
          </Link>
        </Button>
      </div>
    )
}
