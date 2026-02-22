import TeamDetailsPage from '@/features/teams/app/team-details-page'

export default async function Page({ params }) {
  const { id } = await params
  return <TeamDetailsPage teamId={id} />
}
