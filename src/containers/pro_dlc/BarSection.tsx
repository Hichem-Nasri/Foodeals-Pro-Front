'use client'

import React, { useState } from 'react'

interface BarSectionProps {
  onTabChange: (tab: string) => void
}

const BarSection: React.FC<BarSectionProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('tout')

  const tabs = [
    { id: 'tout', label: 'Tout' },
    { id: 'urgente', label: 'Urgente' },
    { id: 'exigee', label: 'Exigée' },
    { id: 'souhaitable', label: 'Souhaitable' }
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange(tabId)
  }

  return (
    <div className="lg:hidden w-full px-1">
      <div className="rounded-[16px] shadow-md bg-white">
        <div className="flex items-stretch justify-around">
          {tabs.map((tab, index) => (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex-1 flex items-center justify-center py-3
                  font-montserrat text-[14px] font-medium
                  transition-colors whitespace-nowrap
                  ${activeTab === tab.id ? 'text-[#FAC215]' : 'text-[#CCCCCC]'}
                `}
              >
                {tab.label}
              </button>
              {index < tabs.length - 1 && (
                <span 
                  className="block min-h-[24px] w-[1px] bg-[#EEEEEE]"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarSection