'use client'
import React, { FC, useEffect } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
    PaginationEllipsis,
} from '../ui/pagination'
import { cn } from '@/lib/utils'

interface PaginationDataProps {
    className?: string
    setCurrentPage: (page: number) => void
    currentPage: number
    totalPages: number
    pageSize: number
    isLoading?: boolean
    refetch?: () => void
}

const PaginationData: FC<PaginationDataProps> = ({
    className,
    setCurrentPage,
    currentPage,
    totalPages,
    pageSize,
    isLoading,
    refetch,
}) => {
    const handlePageChange = (page: number) => {
        if (page < 0 || page >= totalPages) return

        setCurrentPage(page)
    }

    const pages = []
    if (currentPage > 0) pages.push(currentPage - 1)
    pages.push(currentPage)
    if (currentPage < totalPages - 1) {
        pages.push(currentPage + 1)
        if (currentPage + 1 < totalPages - 1) pages.push(currentPage + 2)
    }

    useEffect(() => {
        if (isLoading || !refetch) return
        // refetch()
    }, [currentPage])
    return (
        <div className={cn(`${totalPages < 2 && 'hidden'}`, className)}>
            <Pagination>
                <PaginationContent>
                    {currentPage > 0 && (
                        <PaginationItem>
                            <PaginationPrevious
                                className='cursor-pointer'
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                            />
                        </PaginationItem>
                    )}
                    {pages.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                className='cursor-pointer'
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                            >
                                {page + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {currentPage < totalPages - 1 && (
                        <>
                            {' '}
                            {currentPage + 2 < totalPages - 1 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    className='cursor-pointer'
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                />
                            </PaginationItem>
                        </>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default PaginationData
