'use client'

import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function RowActionsMenu({ label = 'Actions', items }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>

        {items.map((item, index) => {
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={`separator-${index}`} />
          }

          if (item.type === 'link') {
            return (
              <DropdownMenuItem key={`${item.label}-${index}`} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuItem
              key={`${item.label}-${index}`}
              className={item.destructive ? 'text-destructive' : undefined}
              onSelect={(event) => {
                event.preventDefault()
                item.onSelect()
              }}
            >
              {item.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
