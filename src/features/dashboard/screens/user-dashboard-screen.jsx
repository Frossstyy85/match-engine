import { NotImplementedCard } from '@/shared/states/not-implemented-card'

export default function UserDashboardScreen() {
  return (
    <div className='w-full min-w-0 p-4 sm:p-6'>
      <NotImplementedCard
        title='User dashboard'
        description='User-specific analytics and shortcuts will be added in a dedicated pass.'
      />
    </div>
  )
}
