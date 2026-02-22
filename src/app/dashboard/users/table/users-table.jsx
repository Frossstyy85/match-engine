'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

export default function UsersTable({ users }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name ?? 'Unnamed'}</TableCell>
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
