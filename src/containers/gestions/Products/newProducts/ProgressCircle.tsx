import { useEffect, useState } from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface Props {
    totalFiles: number
    completedFiles: number
    withText?: boolean
}

const ProgressCircle = ({
    totalFiles,
    completedFiles,
    withText = true,
}: Props) => {
    const [percentage, setPercentage] = useState(0)

    // Calculate the percentage based on the completed files
    useEffect(() => {
        if (totalFiles === 0 || totalFiles <= completedFiles) return
        setPercentage(Math.round((completedFiles / totalFiles) * 100))
    }, [completedFiles, totalFiles])

    return (
        <div className='flex flex-col items-center'>
            <div className='relative h-48 w-48 rounded-full'>
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%-20px)] text-lg text-lynch-400'>
                    {totalFiles} fichier
                </div>
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    styles={{
                        root: {},
                        path: {
                            stroke: `rgba(52,211,158)`,
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                            transformOrigin: 'center center',
                            strokeWidth: 4,
                        },
                        trail: {
                            stroke: 'rgb(236 ,238 ,242)',
                            strokeLinecap: 'butt',
                            transform: 'rotate(0.25turn)',
                            transformOrigin: 'center center',
                            strokeWidth: 4,
                        },
                        text: {
                            fill: '#23272e',
                            fontSize: '16px',
                            fontWeight: 'semi-bold',
                            padding: '0px',
                            translate: '0 -4px',
                        },
                        background: {
                            fill: '#34d39e',
                        },
                    }}
                />
            </div>
            {completedFiles === totalFiles && withText ? (
                <h1 className='text-sm text-mountain-500'>
                    Fichier chargé avec succès
                </h1>
            ) : (
                withText && (
                    <h1 className='text-sm'>
                        Fichier en cours de chargement...
                    </h1>
                )
            )}
        </div>
    )
}

export default ProgressCircle
