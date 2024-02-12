'use client'

import { useParams } from 'next/navigation'

import { CareerDetailView } from '../../../../../features/careers/presentation/view'
import { DocumentDetailsView } from '../../../../../features/documents/presentation/view'
import { CouncilDetailsView } from '../../../../../features/council/presentation/view'
import { ProcessDetailsView } from '../../../../../features/processes/presentation/view'
import { FunctionaryDetailsView } from '../../../../../features/functionaries/presentation/view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    consejos: CouncilDetailsView,
    carreras: CareerDetailView,
    documentos: DocumentDetailsView,
    procesos: ProcessDetailsView,
    funcionarios: FunctionaryDetailsView,
  }

  const defaultComponent = () => <div>Not found</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(route),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return <Component />
}

export default Page
