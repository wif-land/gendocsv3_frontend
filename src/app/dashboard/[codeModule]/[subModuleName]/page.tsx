'use client'

import { lazy } from 'react'
import { useParams } from 'next/navigation'

import { CouncilListView } from '../../../../features/council/presentation/view'
import { CareerListView } from '../../../../features/careers/presentation/view'
import { DocumentListView } from '../../../../features/documents/presentation/view'
import { FunctionaryListView } from '../../../../features/functionaries/presentation/view'
import { ProcessListView } from '../../../../features/processes/presentation/view'

const UsersView = lazy(
  () => import('../../../../features/modules/components/users-view'),
)

const StudentsView = lazy(
  () => import('../../../../features/modules/components/students-view'),
)

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    usuarios: UsersView,
    estudiantes: StudentsView,
    carreras: CareerListView,
    funcionarios: FunctionaryListView,
    procesos: ProcessListView,
    consejos: CouncilListView,
    documentos: DocumentListView,
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
