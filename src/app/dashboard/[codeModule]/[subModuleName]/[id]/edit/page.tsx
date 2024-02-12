'use client'
import { useParams } from 'next/navigation'
import { ProcessEditView } from '../../../../../../features/processes/presentation/view'
import { CouncilEditView } from '../../../../../../features/council/presentation/view'
import { CareersEditView } from '../../../../../../features/careers/presentation/view'
import { FunctionaryEditView } from '../../../../../../features/functionaries/presentation/view'

const Page = () => {
  const { subModuleName } = useParams()

  const routeToComponent = {
    consejos: CouncilEditView,
    carreras: CareersEditView,
    funcionarios: FunctionaryEditView,
    procesos: ProcessEditView,
  }

  const defaultComponent = () => <div>DEFAULT</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(subModuleName as string),
  )

  return (
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent
  )
}

export default Page
