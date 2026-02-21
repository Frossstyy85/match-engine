import { NotImplementedCard } from '@/shared/states/not-implemented-card'

export default function HrDashboardScreen() {
  return (
    <div className='w-full min-w-0 p-4 sm:p-6'>
      <NotImplementedCard
        title='HR dashboard'
        description='HR analytics panels will be added in a dedicated implementation pass.'
      />
    </div>
  )
}
