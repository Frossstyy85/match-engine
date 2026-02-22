import Link from 'next/link'
import { UserRoundIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { parsePaginationParams } from '@/shared/table/pagination-params'
import TablePagination from '@/shared/table/table-pagination'
import { getUsers as fetchUsersPage } from '@/lib/db/users'
import UsersTable from '@/app/dashboard/users/table/users-table'

export default async function Page({ searchParams }) {
  const { page, pageSize, query } = await parsePaginationParams(searchParams)
  const { rows, totalPages } = await fetchUsersPage({ page, pageSize, query })

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <UserRoundIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>Users</span>
            </h1>
          </div>
        </header>

        <Card className='w-full border-border p-5 shadow-sm'>
          <div className='mb-3 flex flex-wrap items-center gap-3'>
            <form action='/dashboard/users' method='GET' className='flex w-full max-w-md items-center gap-2'>
              <Input
                name='query'
                defaultValue={query ?? ''}
                placeholder='Search by user name'
                aria-label='Search by user name'
              />
              <input type='hidden' name='pageSize' value={pageSize} />
              <Button type='submit' variant='outline'>
                Search
              </Button>
              {query ? (
                <Button asChild variant='ghost'>
                  <Link href={`/dashboard/users?page=1&pageSize=${pageSize}`}>Clear</Link>
                </Button>
              ) : null}
            </form>
          </div>
          <UsersTable users={rows} />
          <TablePagination
            basePath='/dashboard/users'
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            query={query}
          />
        </Card>
      </div>
    </div>
  )
}
