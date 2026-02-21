import CreateSkillForm from '@/features/skills/components/create-skill-form'
import { fetchCategories, fetchSkillsPage } from '@/features/skills/data/skills-repository'
import { columns } from '@/features/skills/table/columns'
import DataTable from '@/shared/table/data-table'

export default async function SkillsListScreen({ page, pageSize }) {
  const [{ rows, totalPages = 1 }, categories] = await Promise.all([
    fetchSkillsPage({ page, pageSize }),
    fetchCategories()
  ])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Skills</h1>
        <CreateSkillForm categories={categories} />
      </div>

      <DataTable
        data={rows}
        columns={columns}
        pagination={{
          currentPage: page,
          totalPages,
          pageSize,
          basePath: '/dashboard/skills'
        }}
      />
    </div>
  )
}
