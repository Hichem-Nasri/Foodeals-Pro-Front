'use client'

import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import {
  ArrowLeft,
  CheckCheck,
  CheckCircle,
  ShoppingBasket,
  Timer,
  Users,
  X,
} from 'lucide-react'
import MobileHeaderDlc from '@/components/custom/MobileHeaderDlc'
import ProductCardDlc from '@/containers/pro_dlc/ProductCardDlc'
import HistoryCard from '@/components/custom/HistoryCard'
import UserHistoryCard from '@/containers/pro_dlc/DlcUserHistory'
import UpdateDlcForm from '@/containers/pro_dlc/history/UpdateDlcForm'
import ConditionProductsDLC from '@/containers/pro_dlc/newProducts/ConditionProductDlc'
import { CustomButton } from '@/components/custom/CustomButton'
import { Layout } from '@/components/layout/Layout'
import DropDownList from '@/containers/pro_dlc/DropDownList'
import { useMediaQuery } from 'react-responsive'
import ProductDetailsForm from '@/containers/pro_dlc/history/ProductInfo'
import { WithdrawalConditions } from '@/containers/pro_dlc/history/ProductConditionsDesktop'
import CollaboratorsHistory, {
  Collaborator,
} from '@/containers/pro_dlc/history/CollaboratorHistory'
import SelectionActions from '@/containers/pro_dlc/global/ActionsButtons'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { appApi, DlcRoutes } from '@/lib/routes'
import api from '@/utils/api'
import { ProductsType } from '@/types/product-type'
import DLCProduct from '@/types/DlcProduct'
import { ProductDlcExtract } from '@/containers/pro_dlc/utils/dataExtract'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import ProductCardDlcSkeleton from '@/containers/pro_dlc/CardSckeleton'
import { useProductDlc } from '../../_context/useProduct'

interface DlcDetailsPageProps {
  id: string
}

const DlcDetailsPage: FC<DlcDetailsPageProps> = ({ id }) => {
  const router = useRouter()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [product, setProduct] = useState<DLCProduct | null>(null)
  const [collab, setCollab] = useState<Collaborator[]>([])
  const [modifications, setModifications] = useState<number>(0)
  const [users, setUsers] = useState<number>(0)
  const [sheet, setSheet] = useState(false)
  const [image, setImage] = useState(false)
  const { notify } = useNotification()
  const { setProductDlc } = useProductDlc()
  const { data, isLoading, error, isRefetching } = useQuery({
    queryKey: ['products-dlc', id],
    queryFn: async () => {
      try {
        const res = await api.get(appApi.dlc + `/${id}`)
        if (res.status !== 200) {
          throw new Error('Erreur lors de la récupération des produits')
        }
        console.log('res: ', res)
        const { dlcResponse, ...data } = res.data
        console.log('dlcResponse: ', dlcResponse)
        const allProducts = ProductDlcExtract(dlcResponse)
        setProduct(allProducts)
        console.log('product', allProducts)
        setModifications(data.modificationsCount)
        setUsers(data.usersCount)
        // const collab = data.users.map(
        //   (user: any) =>
        //     ({
        //       imageUrl: user.avatarPath,
        //       name: user?.name?.firstName + ' ' + user?.name?.lastName,
        //       role: user?.role?.name,
        //       email: user.email,
        //       phone: user.phone,
        //       id: user.id,
        //       modificationDate: new Date().toISOString(),
        //     }) as Collaborator
        // )
        setCollab([])
        return data.content
      } catch (error) {
        notify(
          NotificationType.ERROR,
          'Erreur lors de la récupération de la DLC'
        )
        return null
      }
    },
    placeholderData: keepPreviousData,
  })

  const handleBack = () => {
    router.push(DlcRoutes.dlc)
  }

  const DesktopView = () => (
    <div className='flex w-full flex-col gap-4 pb-4 lg:pb-0'>
      {/* TODO: change this Mobile header when you marge */}
      <div className='hidden w-full justify-end rounded-[18px] bg-white p-2 lg:flex'>
        <DropDownList setSheet={setSheet} setImage={setImage}>
          <span>Ajouter une DLC</span>
          <ShoppingBasket size={22} />
        </DropDownList>
      </div>

      {/* History Cards Container */}
      <div className='flex w-full flex-col-reverse gap-4 px-2 lg:flex-col lg:p-0'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='w-full'>
            <HistoryCard
              Icon={Timer}
              title='Modification'
              value={modifications}
            />
          </div>
          <div className='w-full'>
            <HistoryCard Icon={Users} title='Utilisateur' value={users} />
          </div>
        </div>
        {isMobile ? (
          <>
            {isLoading ? (
              <ProductCardDlcSkeleton />
            ) : (
              <ProductCardDlc product={product!} />
            )}
          </>
        ) : (
          <ProductDetailsForm product={product} />
        )}
      </div>
      <div className='flex w-full flex-col-reverse gap-4 p-2 lg:flex-col lg:p-0'>
        {isMobile ? (
          <ConditionProductsDLC id={product?.id} product={product!} />
        ) : (
          <WithdrawalConditions product={product!} />
        )}
        {isMobile && <UpdateDlcForm />}
        <CollaboratorsHistory collab={collab} isLoading={isLoading} id={id} />
      </div>
      {!isMobile ? (
        <SelectionActions
          onClearSelection={() => {
            router.push(DlcRoutes.dlc)
          }}
          valorisationText='Valorisé un DLC'
          showValorisation={true}
          onValorisation={() => {
            let values: DLCProduct[] = [product!]
            setProductDlc(values)
            router.push(DlcRoutes.Valuation)
            // Valorisation logic here
          }}
        />
      ) : (
        <div className='sticky bottom-0 flex w-full items-center justify-center gap-3 rounded-t-[18px] bg-white p-3'>
          <CustomButton
            variant='outline'
            label='ANNULER'
            IconLeft={X}
            onClick={handleBack}
            className='w-full'
          />
          <CustomButton
            label='CONFIRMER'
            IconRight={CheckCircle}
            onClick={() => {}}
            className='w-full bg-tulip-400 text-white hover:bg-tulip-100 hover:text-tulip-400'
          />
        </div>
      )}
    </div>
  )

  // const MobileView = () => (
  //     <>
  //         <div className='mt-6 flex flex-col gap-4 px-4 pb-24'>
  //             <ProductCardDlc product={} />

  //             <div className='flex gap-4'>
  //                 <HistoryCard
  //                     Icon={Timer}
  //                     title='Modification'
  //                     value={modifications}
  //                 />
  //                 <HistoryCard
  //                     Icon={Users}
  //                     title='Utilisateur'
  //                     value={users}
  //                 />
  //             </div>

  //             <div className='flex flex-col gap-4'>
  //                 {dummyUserHistoryList.map((history) => (
  //                     <UserHistoryCard
  //                         key={history.id}
  //                         history={history}
  //                         rightIcon='eye'
  //                     />
  //                 ))}
  //             </div>
  //         </div>

  //         <div className='fixed bottom-0 left-0 right-0'>
  //             <nav className='flex w-full items-center justify-around space-x-4 rounded-t-[32px] bg-white px-5 py-4 shadow-lg'>
  //                 <CustomButton
  //                     variant='outline'
  //                     label='ANNULER'
  //                     onClick={handleBack}
  //                     className='h-fit w-full px-5 py-3 lg:w-fit'
  //                     IconRight={X}
  //                     type='button'
  //                 />
  //                 <CustomButton
  //                     label='CONFIRMER'
  //                     className='h-fit w-full bg-[#FAC215] px-5 py-3 text-white hover:bg-[#FAC215]'
  //                     IconRight={CheckCheck}
  //                     type='submit'
  //                     form='updateDlcForm'
  //                 />
  //             </nav>
  //         </div>
  //     </>
  // )

  return <DesktopView />
}

export default DlcDetailsPage
