'use client'

import { Suspense, lazy } from 'react'
import { useParams } from 'next/navigation'
import { Stack } from '@mui/material'
import { StaticDatePicker, TimePicker } from '@mui/x-date-pickers'
import { LoadingScreen } from '../../../../shared/components/loading-screen'
import { CouncilListView } from '../../../../features/council/presentation/view'
import { CareerListView } from '../../../../features/careers/presentation/view'

const UsersView = lazy(
  () => import('../../../../features/modules/components/users-view'),
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
    ['admin/carreras']: CareerListView,
    ['admin/funcionarios']: FunctionaryView,
    procesos: ProcessView,
    consejos: CouncilListView,
    documentos: DocumentsView,
  }

  const defaultComponent = () => (
    <Stack spacing={1} alignItems="center">
      <StaticDatePicker orientation="landscape" />
      <TimePicker label="Basic time picker" />
    </Stack>
  )

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component moduleId={codeModule as string} />
    </Suspense>
  )
}

export default Page
