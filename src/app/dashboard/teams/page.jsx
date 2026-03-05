import Link from 'next/link'
import { UsersRoundIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { parsePaginationParams } from '@/shared/table/pagination-params'
import TablePagination from '@/shared/table/table-pagination'
import CreateTeamForm from '@/app/dashboard/teams/components/create-team-form'
import { getTeams as fetchTeamsPage } from '@/lib/db/teams'
import TeamsTable from '@/app/dashboard/teams/table/teams-table'

export default async function Page({ searchParams }) {
  const { page, pageSize, query } = await parsePaginationParams(searchParams)
  const { rows, totalPages } = await fetchTeamsPage({ page, pageSize, query })

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-4'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <UsersRoundIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>Teams</span>
            </h1>
          </div>
        </header>

        <div className='w-full space-y-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <form action='/dashboard/teams' method='GET' className='flex w-full max-w-md items-center gap-2'>
              <Input
                name='query'
                defaultValue={query ?? ''}
                placeholder='Search by team name'
                aria-label='Search by team name'
              />
              <input type='hidden' name='pageSize' value={pageSize} />
              <Button type='submit' variant='outline'>
                Search
              </Button>
              {query ? (
                <Button asChild variant='ghost'>
                  <Link href={`/dashboard/teams?page=1&pageSize=${pageSize}`}>Clear</Link>
                </Button>
              ) : null}
            </form>

            <CreateTeamForm />
          </div>
          <TeamsTable teams={rows} />
          <TablePagination
            basePath='/dashboard/teams'
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            query={query}
          />
        </div>
      </div>
    </div>
  )
}
