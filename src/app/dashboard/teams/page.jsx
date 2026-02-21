import TeamsListScreen from '@/features/teams/screens/teams-list-screen'
import { parsePaginationParams } from '@/shared/table/pagination-params'

export default async function Page({ searchParams }) {
  const { page, pageSize } = await parsePaginationParams(searchParams)
  return <TeamsListScreen page={page} pageSize={pageSize} />
}
