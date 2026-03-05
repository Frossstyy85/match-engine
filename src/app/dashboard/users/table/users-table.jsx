'use client'

import Link from 'next/link'
import { Pen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

function UserActions({ user }) {
  return (
    <Button
      asChild
      size='sm'
      className='h-8 rounded-md bg-orange-500 px-3 text-white hover:bg-orange-600 focus-visible:ring-orange-500/50'
    >
      <Link href={`/dashboard/users/${user.id}`}>
        <Pen className='h-3.5 w-3.5' />
        Edit
      </Link>
    </Button>
  )
}

export default function UsersTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[110px]'>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className='w-[130px]'>Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <span className='inline-block max-w-[96px] truncate font-mono text-xs' title={String(user.id)}>
                {user.id}
              </span>
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/users/${user.id}`}>{user.name ?? 'Unnamed'}</Link>
            </TableCell>
            <TableCell>{user.email ?? '-'}</TableCell>
            <TableCell>
              <UserActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
