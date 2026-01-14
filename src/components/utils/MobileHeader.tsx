'use client'
import { useTitle } from '@/context/TitleContext'
import React, { useContext } from 'react'

interface MobileHeaderProps {
  header: string
  onChange?: (title: string) => void
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ header, onChange }) => {
  const { setTitle } = useTitle()

  React.useEffect(() => {
    // Set the title using the setTitle function from the TitleContext

    setTitle(header)
    return () => {
      setTitle('')
    }
  }, [])

  return null
}

export default MobileHeader
