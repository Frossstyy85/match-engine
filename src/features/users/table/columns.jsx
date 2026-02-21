'use client'

import { RowActionsMenu } from '@/shared/table/row-actions-menu'

function UserActions({ user }) {
  return (
    <RowActionsMenu
      items={[
        {
          type: 'link',
          label: 'View user',
          href: `/dashboard/users/${user.id}`
        }
      ]}
    />
  )
}

export const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => row.original.name ?? 'Unnamed'
  },
  {
    header: 'Email',
    accessorKey: 'email',
    cell: ({ row }) => row.original.email ?? '-'
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserActions user={row.original} />
  }
]
