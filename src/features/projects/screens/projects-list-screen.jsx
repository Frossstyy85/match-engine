import CreateProjectForm from '@/features/projects/components/create-project-form'
import { fetchProjectsPage } from '@/features/projects/data/projects-repository'
import { columns } from '@/features/projects/table/columns'
import DataTable from '@/shared/table/data-table'

export default async function ProjectsListScreen({ page, pageSize, query }) {
  const { rows, totalPages = 1 } = await fetchProjectsPage({
    page,
    pageSize,
    query
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Projects</h1>
        <CreateProjectForm />
      </div>

      <DataTable
        data={rows}
        columns={columns}
        pagination={{
          currentPage: page,
          totalPages,
          pageSize,
          query,
          basePath: '/dashboard/projects'
        }}
      />
    </div>
  )
}
