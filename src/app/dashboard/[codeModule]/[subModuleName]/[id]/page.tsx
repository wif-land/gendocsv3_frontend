'use client'
import { useParams } from 'next/navigation'
import { CareerDetailView } from '../../../../../features/careers/presentation/view'
import { DocumentDetailsView } from '../../../../../features/documents/presentation/view'
import { CouncilDetailsView } from '../../../../../features/council/presentation/view'
import { ProcessDetailsView } from '../../../../../features/processes/presentation/view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    consejos: CouncilDetailsView,
    carreras: CareerDetailView,
    documentos: DocumentDetailsView,
    procesos: ProcessDetailsView,
  }

  const defaultComponent = () => <div>Not found</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  return (
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent
  )
}

export default Page
