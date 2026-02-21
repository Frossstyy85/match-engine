import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchAdminDashboardData } from '@/features/dashboard/data/dashboard-repository'

function StatCard({ label, value, href }) {
  return (
    <Link href={href}>
      <Card className='h-full hover:bg-muted/40'>
        <CardHeader>
          <CardTitle className='text-sm text-muted-foreground'>{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-semibold'>{value}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function RecentList({ title, items, emptyLabel, renderItem }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className='text-sm text-muted-foreground'>{emptyLabel}</p>
        ) : (
          <ul className='space-y-2 text-sm'>
            {items.map((item) => (
              <li key={item.id}>{renderItem(item)}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboardScreen() {
  const { counts, latestProjects, latestUsers, latestTeams } = await fetchAdminDashboardData()

  return (
    <div className='w-full min-w-0 p-4 sm:p-6'>
      <div className='mx-auto grid max-w-6xl gap-6'>
        <header>
          <h1 className='text-2xl font-semibold sm:text-3xl'>Admin dashboard</h1>
          <p className='text-sm text-muted-foreground'>Overview of users, projects, and teams.</p>
        </header>

        <section className='grid gap-4 md:grid-cols-3'>
          <StatCard label='Projects' value={counts.projects} href='/dashboard/projects' />
          <StatCard label='Users' value={counts.users} href='/dashboard/users' />
          <StatCard label='Teams' value={counts.teams} href='/dashboard/teams' />
        </section>

        <section className='grid gap-4 md:grid-cols-3'>
          <RecentList
            title='Recent projects'
            items={latestProjects}
            emptyLabel='No recent projects.'
            renderItem={(project) => (
              <>
                New project: <span className='font-medium'>{project.name}</span>
              </>
            )}
          />

          <RecentList
            title='Recent users'
            items={latestUsers}
            emptyLabel='No recent users.'
            renderItem={(user) => (
              <>
                New user: <span className='font-medium'>{user.email ?? user.name}</span>
              </>
            )}
          />

          <RecentList
            title='Recent teams'
            items={latestTeams}
            emptyLabel='No recent teams.'
            renderItem={(team) => (
              <>
                New team: <span className='font-medium'>{team.name}</span>
              </>
            )}
          />
        </section>
      </div>
    </div>
  )
}
