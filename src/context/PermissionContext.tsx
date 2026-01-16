'use client'

import { Roles } from '@/types/GlobalType'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect } from 'react'

type PermissionUser = {
  role?: Roles | string
}

interface PermissionContextType {
  user: PermissionUser | null
  hasRole: (role: Roles) => boolean
  hasAnyRole: (roles: Roles[]) => boolean
  hasAuthority: (authority: string) => boolean
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
)

export const usePermissions = () => {
  const context = useContext(PermissionContext)
  if (!context) {
    throw new Error('usePermissions must be used within PermissionProvider')
  }
  return context
}

interface PermissionProviderProps {
  user: PermissionUser | null
  children?: React.ReactNode
}

const PermissionProvider: React.FC<PermissionProviderProps> = ({
  user,
  children,
}) => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Redirect Delivery Man to /delivery
    if (user?.role === Roles.DELIVERY_MAN && !pathname.includes('/delivery')) {
      router.push('/delivery')
    }
  }, [user, router, pathname])

  const hasRole = (role: Roles): boolean => {
    return user?.role === role
  }

  const hasAnyRole = (roles: Roles[]): boolean => {
    return roles.some((role) => user?.role === role)
  }

  const hasAuthority = (authority: string): boolean => {
    return user?.role?.includes(authority) || false
  }

  const value: PermissionContextType = {
    user,
    hasRole,
    hasAnyRole,
    hasAuthority,
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  )
}

export default PermissionProvider
