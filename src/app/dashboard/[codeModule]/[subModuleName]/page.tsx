'use client'

import { Suspense, lazy } from 'react'
import { useParams } from 'next/navigation'

const UsersView = lazy(
  () => import('../../../../features/modules/components/users-view'),
)
const CareersView = lazy(
  () => import('../../../../features/careers/components/CareersView'),
)
const StudentsView = lazy(
  () => import('../../../../features/modules/components/students-view'),
)
const FunctionaryView = lazy(
  () => import('../../../../features/modules/components/functionary-view'),
)
const ProcessView = lazy(
  () =>
    import(
      '../../../../features/processes/presentation/components/ProcessesView'
    ),
)
const CouncilsView = lazy(
  () =>
    import('../../../../features/council/presentation/components/CouncilsView'),
)

const DocumentsView = lazy(
  () =>
    import(
      '../../../../features/documents/presentation/components/DocumentsView'
    ),
)

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    ['admin/usuarios']: UsersView,
    ['admin/estudiantes']: StudentsView,
    ['admin/carreras']: CareersView,
    ['admin/funcionarios']: FunctionaryView,
    procesos: ProcessView,
    consejos: CouncilsView,
    documentos: DocumentsView,
  }

  const defaultComponent = () => <div>DEFAULT</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component moduleId={codeModule as string} />
    </Suspense>
  )
}

export default Page
