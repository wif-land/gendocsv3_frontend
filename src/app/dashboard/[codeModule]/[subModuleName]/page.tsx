'use client'
import { useParams } from 'next/navigation'
import UsersView from '../../../../features/modules/components/users-view'
import CareersView from '../../../../features/careers/components/CareersView'
import StudentsView from '../../../../features/modules/components/students-view'
import FunctionaryView from '../../../../features/modules/components/functionary-view'
import ProcessView from '../../../../features/modules/components/process-view'
import CouncilsView from '../../../../features/council/presentation/components/CouncilsView'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const resolveViewByRoute = (route: string) => {
    switch (route) {
      case 'admin/usuarios':
        return <UsersView />
      case 'admin/estudiantes':
        return <StudentsView />
      case 'admin/carreras':
        return <CareersView />
      case 'admin/funcionarios':
        return <FunctionaryView />
      case 'facu/procesos':
        return <ProcessView moduleId={codeModule as string} />
      case RegExp('consejos').test(route) ? route : '':
        return <CouncilsView moduleId={codeModule as string} />
      default:
        return <div>DEFAULT</div>
    }
  }

  return resolveViewByRoute(route)
}

export default Page
