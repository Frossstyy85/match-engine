import UserDetailsPage from '@/features/users/app/user-details-page'

export default async function Page({ params }) {
  const { id } = await params
  return <UserDetailsPage userId={id} />
}
