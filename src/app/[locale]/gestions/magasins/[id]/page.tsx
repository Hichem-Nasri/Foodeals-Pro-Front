import { getStore } from '@/actions/store'
import PleaseWait from '@/components/custom/PleaseWait';
import { Layout } from '@/components/layout/Layout'
import Store from '@/containers/gestions/Stores/newStore'
import { countries } from '@/utils/utils'
// import Error from '@/app/error'

interface StoreProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    mode: string
  }>
}

// This is an async Server Component
export default async function Page({
  params,
  searchParams,
}: StoreProps) {
  const { id } = await params
  const { mode } = await searchParams
  let data = undefined
  data = await getStore(id)
  return (
    <Layout formTitle='stores.addStore'>
      {data == undefined ? (
        <PleaseWait />
      ) : data.data == null ? (
        <div>Error</div>
      ) : (
        <Store
          data={data.data}
          id={id == 'new' ? '' : id}
          mode={mode}
          dialCode={(() => {
            if (data.data.phone) {
              const code =
                countries.find((val) =>
                  data.data.phone.includes(
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
      )}
    </Layout>
  )
}
