import Link from 'next/link'
import { LightbulbIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { parsePaginationParams } from '@/shared/table/pagination-params'
import TablePagination from '@/shared/table/table-pagination'
import CreateSkillForm from '@/app/dashboard/skills/components/create-skill-form'
import { getSkills as fetchSkillsPage } from '@/lib/db/skills'
import SkillsTable from '@/app/dashboard/skills/table/skills-table'

export default async function Page({ searchParams }) {
  const { page, pageSize, query } = await parsePaginationParams(searchParams)
  const { rows, categories, totalPages } = await fetchSkillsPage({ page, pageSize, query })

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-4'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <LightbulbIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>Skills</span>
            </h1>
          </div>
        </header>

        <div className='w-full space-y-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <form action='/dashboard/skills' method='GET' className='flex w-full max-w-md items-center gap-2'>
              <Input
                name='query'
                defaultValue={query ?? ''}
                placeholder='Search by skill name'
                aria-label='Search by skill name'
              />
              <input type='hidden' name='pageSize' value={pageSize} />
              <Button type='submit' variant='outline'>
                Search
              </Button>
              {query ? (
                <Button asChild variant='ghost'>
                  <Link href={`/dashboard/skills?page=1&pageSize=${pageSize}`}>Clear</Link>
                </Button>
              ) : null}
            </form>

            <CreateSkillForm categories={categories} />
          </div>
          <SkillsTable skills={rows} categories={categories} />
          <TablePagination
            basePath='/dashboard/skills'
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
