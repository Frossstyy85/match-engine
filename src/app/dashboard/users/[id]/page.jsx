import UserDetailsScreen from '@/features/users/screens/user-details-screen'

export default async function Page({ params }) {
  const { id } = await params
  return <UserDetailsScreen userId={id} />
}
