'use client'

import { useParams } from 'next/navigation'
import { Stack } from '@mui/material'
import { CouncilCreateView } from '../../../../../features/council/presentation/view'
import { CareerCreateView } from '../../../../../features/careers/presentation/view'
import { DocumentCreateView } from '../../../../../features/documents/presentation/view'
import { FunctionaryCreateView } from '../../../../../features/functionaries/presentation/view'
import { ProcessCreateView } from '../../../../../features/processes/presentation/view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    consejos: CouncilCreateView,
    carreras: CareerCreateView,
    documentos: DocumentCreateView,
    funcionarios: FunctionaryCreateView,
    procesos: ProcessCreateView,
  }

  const defaultComponent = () => <Stack>404</Stack>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  return (
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent
  )
}

export default Page
