import TeamDetailsScreen from '@/features/teams/screens/team-details-screen'

export default async function Page({ params }) {
  const { id } = await params
  return <TeamDetailsScreen teamId={Number(id)} />
}
