import { getUser } from '@/actions'
import { getDataUser } from '@/actions/User'
// import Error from '@/app/error'
import { Layout } from '@/components/layout/Layout'
import UserDetails from '@/containers/gestions/Users/UserDetails'
import { countries } from '@/utils/utils'
import React from 'react'

interface pageProps {
  params: Promise<{
    id: string
    locale: string
  }>
  searchParams: Promise<{
    mode: string
    partner: string
  }>
}

const UserDetailsPage: React.FC<
  pageProps
> = async ({
  searchParams,
  params,
}) => {
  const { id, locale } = await params
  const { mode, partner } =
    await searchParams
  const User = await getDataUser(id)
  const session = await getUser()
  
  // Import translations dynamically on server
  const translations = await import(`@/messages/${locale}.json`)
  const t = translations.default
  
  const getTitle = () => {
    if (['', 'new'].includes(id)) {
      return t.collaborators.newCollaborator
    }
    return t.collaborators.collaborator
  }

  return (
    <Layout
      formTitle={getTitle()}
    >
      {User ? (
        <UserDetails
          id={id == 'new' ? '' : id}
          mode={mode}
          partner={partner}
          User={User}
          session={session!}
          dialCode={(() => {
            if (User.phone) {
              const code =
                countries.find((val) =>
                  User.phone.includes(
                    val.dialCode
                  )
                )?.dialCode
              console.log(
                ' code ',
                code
              )
              return code
                ? code
                : '+212'
            }
            return '+212'
          })()}
        />
      ) : (
        <div>Error</div>
      )}
    </Layout>
  )
}

export default UserDetailsPage
