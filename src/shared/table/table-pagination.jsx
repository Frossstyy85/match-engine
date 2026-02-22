'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Ellipsis } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function buildHref(page, pagination) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('pageSize', String(pagination.pageSize))

  if (pagination.query) {
    params.set('query', pagination.query)
  }

  return `${pagination.basePath}?${params.toString()}`
}

function buildPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items = [1]
  const start = Math.max(2, currentPage - 2)
  const end = Math.min(totalPages - 1, currentPage + 2)

  if (start > 2) items.push('ellipsis')

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (end < totalPages - 1) items.push('ellipsis')

  items.push(totalPages)
  return items
}

function NavigatePopover({ totalPages, currentPage, pagination }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(String(currentPage))

  useEffect(() => {
    setMounted(true)
  }, [])

  function sanitizePage(rawValue) {
    const parsed = Number(rawValue)
    if (!Number.isFinite(parsed)) return currentPage
    return Math.min(totalPages, Math.max(1, Math.floor(parsed)))
  }

  function onSubmit(event) {
    event.preventDefault()
    const targetPage = sanitizePage(inputValue)
    setOpen(false)
    router.push(buildHref(targetPage, pagination))
  }

  if (!mounted) {
    return (
      <Button variant='ghost' disabled aria-label='Jump to page'>
        <Ellipsis />
      </Button>
    )
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (nextOpen) setInputValue(String(currentPage))
      }}
    >
      <PopoverTrigger asChild>
        <Button variant='ghost' aria-label='Jump to page'>
          <Ellipsis />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-56'>
        <form onSubmit={onSubmit} className='space-y-3'>
          <p className='text-sm font-medium'>Jump to page</p>

          <ButtonGroup>
            <Input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value.replace(/[^\d]/g, ''))}
              inputMode='numeric'
              aria-label='Page number'
            />
            <Button type='submit'>Go</Button>
          </ButtonGroup>

          <p className='text-xs text-muted-foreground'>Enter a value between 1 and {totalPages}.</p>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default function TablePagination({ basePath, currentPage, totalPages, pageSize, query }) {
  const pagination = { basePath, currentPage, totalPages, pageSize, query }
  const safeCurrentPage = Math.max(1, currentPage)
  const safeTotalPages = Math.max(1, totalPages)

  if (safeTotalPages <= 1) return null

  const pageItems = buildPageItems(safeCurrentPage, safeTotalPages)

  return (
    <div className='mt-4 flex items-center justify-center gap-1'>
      {pageItems.map((item, index) =>
        item === 'ellipsis' ? (
          <NavigatePopover
            key={`ellipsis-${index}`}
            totalPages={safeTotalPages}
            currentPage={safeCurrentPage}
            pagination={pagination}
          />
        ) : (
          <Button key={item} asChild variant={item === safeCurrentPage ? 'default' : 'ghost'}>
            <Link href={buildHref(item, pagination)}>{item}</Link>
          </Button>
        )
      )}
    </div>
  )
}
