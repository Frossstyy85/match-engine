import ProjectsListScreen from '@/features/projects/screens/projects-list-screen'
import { parsePaginationParams } from '@/shared/table/pagination-params'

export default async function Page({ searchParams }) {
  const { page, pageSize, query } = await parsePaginationParams(searchParams)
  return <ProjectsListScreen page={page} pageSize={pageSize} query={query} />
}
