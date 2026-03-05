import Link from 'next/link'
import { FolderKanbanIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { parsePaginationParams } from '@/shared/table/pagination-params'
import TablePagination from '@/shared/table/table-pagination'
import CreateProjectForm from '@/app/dashboard/projects/components/create-project-form'
import { getProjects as fetchProjectsPage } from '@/lib/db/projects'
import ProjectsTable from '@/app/dashboard/projects/table/projects-table'

export default async function Page({ searchParams }) {
  const { page, pageSize, query } = await parsePaginationParams(searchParams)
  const { rows, totalPages } = await fetchProjectsPage({ page, pageSize, query })

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-4'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <FolderKanbanIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>Projects</span>
            </h1>
          </div>
        </header>

        <div className='w-full space-y-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <form action='/dashboard/projects' method='GET' className='flex w-full max-w-md items-center gap-2'>
              <Input
                name='query'
                defaultValue={query ?? ''}
                placeholder='Search by project name'
                aria-label='Search by project name'
              />
              <input type='hidden' name='pageSize' value={pageSize} />
              <Button type='submit' variant='outline'>
                Search
              </Button>
              {query ? (
                <Button asChild variant='ghost'>
                  <Link href={`/dashboard/projects?page=1&pageSize=${pageSize}`}>Clear</Link>
                </Button>
              ) : null}
            </form>

            <CreateProjectForm />
          </div>

          <ProjectsTable projects={rows} />
          <TablePagination
            basePath='/dashboard/projects'
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
