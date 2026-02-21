import CreateTeamForm from '@/features/teams/components/create-team-form'
import { fetchTeamsPage } from '@/features/teams/data/teams-repository'
import { columns } from '@/features/teams/table/columns'
import DataTable from '@/shared/table/data-table'

export default async function TeamsListScreen({ page, pageSize }) {
  const { rows, totalPages = 1 } = await fetchTeamsPage({ page, pageSize })

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Teams</h1>
        <CreateTeamForm />
      </div>

      <DataTable
        data={rows}
        columns={columns}
        pagination={{
          currentPage: page,
          totalPages,
          pageSize,
          basePath: '/dashboard/teams'
        }}
      />
    </div>
  )
}
