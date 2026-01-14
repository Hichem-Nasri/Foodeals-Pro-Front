import { Timer, Calendar } from 'lucide-react'

interface LastModificationProps {
  userName: string
  date: string
  timeRange: string
  modificationDate: string
}

export function LastModification({ userName, date, timeRange, modificationDate }: LastModificationProps) {
  return (
    <div className="lg:static lg:w-[99.5%] lg:mx-auto lg:mt-0 fixed bottom-[60px] left-0 right-0 w-full">
      <div className="mx-auto w-full px-4 lg:px-0 mb-2">
        <div className="px-3 py-3 lg:px-6 lg:py-6 bg-white rounded-2xl shadow-sm flex flex-col lg:flex-row lg:justify-between lg:items-start">
          <div className="mb-2 lg:mb-0 lg:w-1/2">
            <h2 className="font-montserrat text-[16px] lg:text-[20px] font-semibold leading-[19px] lg:leading-[24px] text-[#0A1629] mb-1 lg:mb-2">
              Dernière modification
            </h2>
            <div className="font-montserrat text-[13px] lg:text-[16px] font-medium leading-[16px] lg:leading-[19px] text-[#334766]">
              {userName}
            </div>
          </div>
          
          <div className="flex flex-col lg:w-1/2">
            <div className="font-montserrat text-[13px] lg:text-[16px] font-medium leading-[16px] lg:leading-[19px] text-[#0A1629] mb-2 lg:mb-3">
              Date
            </div>
            <div className="flex items-center gap-4 lg:gap-8">
              <div className="flex items-center gap-2 lg:gap-3">
                <Calendar className="w-3 h-3 lg:w-6 lg:h-6 text-[#556C86]" />
                <span className="font-montserrat text-[13px] lg:text-[17px] font-medium leading-[16px] lg:leading-[20px] text-[#556C86]">
                  {date}
                </span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <Timer className="w-3 h-3 lg:w-6 lg:h-6 text-[#556C86]" />
                <span className="font-montserrat text-[13px] lg:text-[17px] font-medium leading-[16px] lg:leading-[20px] text-[#556C86]">
                  {timeRange}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}