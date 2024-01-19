'use client'
import { useParams } from 'next/navigation'
import TemplateView from '../../../../../features/templates/presentation/components/TemplatesView'
import { CareerDetailView } from '../../../../../features/careers/presentation/view'
import { DocumentDetailsView } from '../../../../../features/documents/presentation/view'
import { StaticDatePicker, TimePicker } from '@mui/x-date-pickers'
import { CouncilDetailsView } from '../../../../../features/council/presentation/view'

const Page = () => {
  const { codeModule, subModuleName, id } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    procesos: () => <TemplateView processId={id as string} />,
    consejos: CouncilDetailsView,
    carreras: CareerDetailView,
    documentos: DocumentDetailsView,
  }

  const defaultComponent = () => (
    <div>
      <StaticDatePicker orientation="landscape" />
      <TimePicker label="Basic time picker" />
    </div>
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
