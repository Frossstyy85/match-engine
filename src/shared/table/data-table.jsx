'use client'

import { getCoreRowModel } from '@tanstack/table-core'
import { flexRender, useReactTable } from '@tanstack/react-table'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Ellipsis } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

export default function DataTable({ data, columns, pagination }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const currentPage = pagination ? Math.max(1, pagination.currentPage) : 1
  const totalPages = pagination ? Math.max(1, pagination.totalPages) : 1
  const showPagination = Boolean(pagination && totalPages > 1)
  const pageItems = buildPageItems(currentPage, totalPages)

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && pagination ? (
        <div className='mt-4 flex items-center justify-center gap-1'>
          {pageItems.map((item, index) =>
            item === 'ellipsis' ? (
              <NavigatePopover
                key={`ellipsis-${index}`}
                totalPages={totalPages}
                currentPage={currentPage}
                pagination={pagination}
              />
            ) : (
              <Button key={item} asChild variant={item === currentPage ? 'outline' : 'ghost'}>
                <Link href={buildHref(item, pagination)}>{item}</Link>
              </Button>
            )
          )}
        </div>
      ) : null}
    </div>
  )
}
