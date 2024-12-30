'use client'

import { useParams } from 'next/navigation'

import { CouncilListView } from '../../../../features/council/presentation/view'
import { CareerListView } from '../../../../features/careers/presentation/view'
import { FunctionaryListView } from '../../../../features/functionaries/presentation/view'
import { ProcessListView } from '../../../../features/processes/presentation/view'
import { StudentListView } from '../../../../features/students/presentation/view'
import { PositionListView } from '../../../../features/positions/presentation/view'
import { UsersListView } from '../../../../features/users/presentation/view'
import { DegreeCertificateListView } from '../../../../features/degree-certificates/presentation/views'
import { DefaultMembersView } from '../../../../features/default-members/presentation/view'
import NotFound from '../../../not-found'
import { DocumentsListViewPage } from '@/features/documents/presentation/enclosuredPages'

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
    documentos: DocumentsListViewPage,
    cargos: PositionListView,
    actas_de_grado: DegreeCertificateListView,
    representantes: DefaultMembersView,
  }

  const defaultComponent = () => <NotFound />

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return <Component moduleId={codeModule as string} />
}

export default Page
