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
import { useModuleValidation } from '@/shared/hooks/useModuleValidation'
import Loading from '@/app/loading'

const Page = () => {
  const { codeModule, subModuleName } = useParams()
  const { moduleId, isLoading } = useModuleValidation(codeModule as string)
  const path = window.location.pathname

  const boundedCode = codeModule != null ? codeModule : path.split('/')[2]

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

  if (isLoading) {
    return <Loading />
  }

  const route = `${boundedCode}/${subModuleName}`

  const defaultComponent = () => <NotFound />

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return moduleId ? (
    <Component moduleId={boundedCode as string} />
  ) : (
    <NotFound />
  )
}

export default Page
