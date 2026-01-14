import { useEffect, useRef } from 'react'
import { useMediaQuery } from 'react-responsive'

export function useUpdateBodyBottomMargin() {
    const ref = useRef<HTMLDivElement>(null)
    const isMaxlg = useMediaQuery({ query: '(max-width: 1024px)' })
    useEffect(() => {
        const updateBodyBottomMargin = () => {
            if (!ref.current) return

            if (isMaxlg) {
                window.document.body.style.marginBottom = `${ref.current.offsetHeight}px`
            } else {
                window.document.body.style.marginBottom = `0px`
            }
        }

        updateBodyBottomMargin()
        window.addEventListener('resize', updateBodyBottomMargin)
        return () => {
            window.removeEventListener('resize', updateBodyBottomMargin)
            document.body.style.paddingBottom = ''
        }
    }, [isMaxlg])

    return { ref }
}
