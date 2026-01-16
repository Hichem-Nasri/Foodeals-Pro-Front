'use client'
import { Roles } from '@/types/GlobalType'
import React, {
  createContext,
  useContext,
} from 'react'

type UserRoleContextType = {
  role: Roles
  userId: string
  organizationId?: string | null
}

// Create the context with a default value
const UserRoleContext =
  createContext<UserRoleContextType>({
    role: Roles.DELIVERY_MAN,
    userId: '',
    organizationId: null,
  })

// Context provider component
export const UserRoleProvider: React.FC<{
  children: React.ReactNode
  role: Roles
  userId: string
  organizationId?: string | null
}> = ({
  children,
  role,
  userId,
  organizationId,
}) => {
  return (
    <UserRoleContext.Provider
      value={{ role, userId, organizationId }}
    >
      {children}
    </UserRoleContext.Provider>
  )
}

// Custom hook to use the user role context
export const useUserRole = () => {
  const context = useContext(
    UserRoleContext
  )

  if (context === undefined) {
    throw new Error(
      'useUserRole must be used within a UserRoleProvider'
    )
  }

  return context
}
