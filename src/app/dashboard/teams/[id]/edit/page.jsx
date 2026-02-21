import EditTeamScreen from '@/features/teams/screens/edit-team-screen'

export default async function Page({ params }) {
  const { id } = await params
  return <EditTeamScreen teamId={Number(id)} />
}
