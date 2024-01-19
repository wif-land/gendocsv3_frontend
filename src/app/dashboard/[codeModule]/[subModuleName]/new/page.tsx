'use client'

import { useParams } from 'next/navigation'
import { Stack } from '@mui/material'
import { StaticDatePicker, TimePicker } from '@mui/x-date-pickers'
import { CouncilCreateView } from '../../../../../features/council/presentation/view'
import { CareerCreateView } from '../../../../../features/careers/presentation/view'
import { DocumentCreateView } from '../../../../../features/documents/presentation/view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    ['consejos']: CouncilCreateView,
    ['carreras']: CareerCreateView,
    documentos: DocumentCreateView,
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

  return <Component />
}

export default Page
