import EditTeamPage from '@/app/dashboard/teams/[id]/edit/edit-team-page'

export default async function Page({ params }) {
  const { id } = await params
  return <EditTeamPage teamId={id} />
}
