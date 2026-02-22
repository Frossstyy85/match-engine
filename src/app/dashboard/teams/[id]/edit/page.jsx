import EditTeamPage from '@/features/teams/app/edit-team-page'

export default async function Page({ params }) {
  const { id } = await params
  return <EditTeamPage teamId={id} />
}
