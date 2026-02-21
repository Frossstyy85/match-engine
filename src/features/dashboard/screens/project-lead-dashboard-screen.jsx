import CreateProjectForm from '@/features/projects/components/create-project-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProjectLeadDashboardScreen() {
  return (
    <div className='w-full min-w-0 p-4 sm:p-6'>
      <div className='mx-auto grid max-w-4xl gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Project lead dashboard</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground'>Use projects and teams pages for management flows.</p>
            <CreateProjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
