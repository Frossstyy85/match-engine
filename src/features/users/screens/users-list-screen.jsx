import DataTable from '@/shared/table/data-table'
import { fetchUsersPage } from '@/features/users/data/users-repository'
import { columns } from '@/features/users/table/columns'

export default async function UsersListScreen({ page, pageSize }) {
  const { rows, totalPages = 1 } = await fetchUsersPage({ page, pageSize })

  return (
    <DataTable
      data={rows}
      columns={columns}
      pagination={{
        currentPage: page,
        totalPages,
        pageSize,
        basePath: '/dashboard/users'
      }}
    />
  )
}
