// import { useTranslations } from '@/i18n/context';
import React from 'react'

const PleaseWait: React.FC = () => {
		// const t = useTranslations()
		return (
				<div className="flex flex-col items-center justify-center h-screen bg-white w-full rounded-[18px] p-4">
						<div className="text-2xl font-normal flex items-center text-lynch-400">
								{/* {t.common.loading.replace("...", "")} */}
								Loading
								<span className="dot animate-bounce">.</span>
								<span className="dot animate-bounce delay-200">.</span>
								<span className="dot animate-bounce delay-300">.</span>
						</div>
				</div>
		)
}

export default PleaseWait
