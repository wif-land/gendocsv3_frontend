'use client'

import { useParams } from 'next/navigation'

import { DocumentDetailsView } from '../../../../../features/documents/presentation/view'
import { CouncilDetailsView } from '../../../../../features/council/presentation/view'
import { ProcessDetailsView } from '../../../../../features/processes/presentation/view'
import { FunctionaryDetailsView } from '../../../../../features/functionaries/presentation/view'
import DegreeCertificateDetailsView from '../../../../../features/degree-certificates/presentation/views/DegreeCertificateDetailsView'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  const routeToComponent = {
    consejos: CouncilDetailsView,
    documentos: DocumentDetailsView,
    procesos: ProcessDetailsView,
    funcionarios: FunctionaryDetailsView,
    actas_de_grado: DegreeCertificateDetailsView,
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
