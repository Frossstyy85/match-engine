import { fetchUser } from '@/features/users/data/users-repository'

export default async function UserDetailsScreen({ userId }) {
  const user = await fetchUser(userId)

  return (
    <div>
      <pre>{JSON.stringify(user, null, 3)}</pre>
    </div>
  )
}
