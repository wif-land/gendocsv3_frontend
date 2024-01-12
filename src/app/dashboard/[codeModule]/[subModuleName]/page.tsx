'use client'

import { useParams } from 'next/navigation'
import UsersView from '../../../../features/modules/components/users-view'
import CareersView from '../../../../features/careers/components/CareersView'
import StudentsView from '../../../../features/modules/components/students-view'
import FunctionaryView from '../../../../features/modules/components/functionary-view'
import ProcessView from '../../../../features/processes/presentation/components/ProcessesView'
import CouncilsView from '../../../../features/council/presentation/components/CouncilsView'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    ['admin/usuarios']: <UsersView />,
    ['admin/estudiantes']: <StudentsView />,
    ['admin/carreras']: <CareersView />,
    ['admin/funcionarios']: <FunctionaryView />,
    procesos: <ProcessView moduleId={codeModule as string} />,
    consejos: <CouncilsView moduleId={codeModule as string} />,
  }

  const defaultComponent = <div>DEFAULT</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  return (
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent
  )
}

export default Page
