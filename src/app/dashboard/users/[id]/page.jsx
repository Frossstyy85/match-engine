import UserDetailsPage from '@/app/dashboard/users/[id]/user-details-page'

export default async function Page({ params }) {
  const { id } = await params
  return <UserDetailsPage userId={id} />
}
