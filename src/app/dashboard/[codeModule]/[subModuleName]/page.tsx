'use client'
import { useParams } from 'next/navigation'
import UsersView from '../../../../features/modules/components/users-view'
import CareersView from '../../../../features/careers/components/CareersView'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const resolveViewByRoute = (route: string) => {
    switch (route) {
      case 'ADMIN/Usuarios':
        return <UsersView />
      case 'ADMIN/Carreras':
        return <CareersView />
      default:
        return <div>DEFAULT</div>
    }
  }

  return resolveViewByRoute(route)
}

export default Page
