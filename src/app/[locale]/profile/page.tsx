import { getUser } from '@/actions'
import { getProfile } from '@/actions/User'
import PleaseWait from '@/components/custom/PleaseWait';
import { Layout } from '@/components/layout/Layout'
import Profile from '@/containers/profile'
import { ProfileType } from '@/schemas/gestion/profile-schema'
import React from 'react'

const ProfilePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  const user = await getUser()
  const profile = (await getProfile(user?.id!)) as ProfileType | null
  
  
  return (
    <Layout formTitle={'profilePage.personalInfo'}>
      {profile ? (
        <Profile user={user!} profile={profile!} />
      ) : (
        <PleaseWait />
      )}
    </Layout>
  )
}

export default ProfilePage
