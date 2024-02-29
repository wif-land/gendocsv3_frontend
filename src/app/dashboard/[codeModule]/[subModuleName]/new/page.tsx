'use client'

import { useParams } from 'next/navigation'

import { Stack } from '@mui/material'

import { CouncilCreateView } from '../../../../../features/council/presentation/view'
import { CareerCreateView } from '../../../../../features/careers/presentation/view'
import { DocumentCreateView } from '../../../../../features/documents/presentation/view'
import { FunctionaryCreateView } from '../../../../../features/functionaries/presentation/view'
import { ProcessCreateView } from '../../../../../features/processes/presentation/view'
import { StudentCreateView } from '../../../../../features/students/presentation/view'
import { PositionCreateView } from '../../../../../features/positions/presentation/view'
import { UsersCreateView } from '../../../../../features/users/presentation/view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    estudiantes: StudentCreateView,
    consejos: CouncilCreateView,
    carreras: CareerCreateView,
    documentos: DocumentCreateView,
    funcionarios: FunctionaryCreateView,
    procesos: ProcessCreateView,
    cargos: PositionCreateView,
    usuarios: UsersCreateView,
  }

  const defaultComponent = () => <Stack>404</Stack>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return <Component />
}

export default Page
