'use client'

import { useParams } from 'next/navigation'

import { CouncilListView } from '../../../../features/council/presentation/view'
import { CareerListView } from '../../../../features/careers/presentation/view'
import { DocumentListView } from '../../../../features/documents/presentation/view'
import { FunctionaryListView } from '../../../../features/functionaries/presentation/view'
import { ProcessListView } from '../../../../features/processes/presentation/view'
import { StudentListView } from '../../../../features/students/presentation/view'
import { PositionListView } from '../../../../features/positions/presentation/view'
import { UsersListView } from '../../../../features/users/presentation/view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    usuarios: UsersListView,
    estudiantes: StudentListView,
    carreras: CareerListView,
    funcionarios: FunctionaryListView,
    procesos: ProcessListView,
    consejos: CouncilListView,
    documentos: DocumentListView,
    cargos: PositionListView,
  }

  const defaultComponent = () => <div>Not found</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return <Component moduleId={codeModule as string} />
}

export default Page
