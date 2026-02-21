import AdminDashboardScreen from '@/features/dashboard/screens/admin-dashboard-screen'
import HrDashboardScreen from '@/features/dashboard/screens/hr-dashboard-screen'
import ProjectLeadDashboardScreen from '@/features/dashboard/screens/project-lead-dashboard-screen'
import UserDashboardScreen from '@/features/dashboard/screens/user-dashboard-screen'
import { fetchDashboardRole } from '@/features/dashboard/data/dashboard-repository'

export default async function DashboardPage() {
  const role = await fetchDashboardRole()

  switch (role) {
    case 'admin':
      return <AdminDashboardScreen />
    case 'hr':
      return <HrDashboardScreen />
    case 'project_lead':
      return <ProjectLeadDashboardScreen />
    default:
      return <UserDashboardScreen />
  }
}
