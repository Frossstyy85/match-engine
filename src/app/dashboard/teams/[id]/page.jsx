import TeamDetailsPage from '@/app/dashboard/teams/[id]/team-details-page'

export default async function Page({ params }) {
  const { id } = await params
  return <TeamDetailsPage teamId={id} />
}
