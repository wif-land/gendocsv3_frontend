'use client'
import { useParams } from 'next/navigation'
import UsersView from '../../../../features/modules/components/users-view'
import CareersView from '../../../../features/careers/components/CareersView'
import StudentsView from '../../../../features/modules/components/students-view'
import FunctionaryView from '../../../../features/modules/components/functionary-view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const resolveViewByRoute = (route: string) => {
    switch (route) {
      case 'admin/Usuarios':
        return <UsersView />
      case 'admin/Estudiantes':
        return <StudentsView />
      case 'admin/Carreras':
        return <CareersView />
      case 'admin/Funcionarios':
        return <FunctionaryView />
      default:
        return <div>DEFAULT</div>
    }
  }

  return resolveViewByRoute(route)
}

export default Page
