'use client'
import { useParams } from 'next/navigation'
import CouncilEditView from '../../../../../../features/council/presentation/view/council-edit-view'
import { CareersEditView } from '../../../../../../features/careers/presentation/view'
import { FunctionaryEditView } from '../../../../../../features/functionaries/presentation/view'

const Page = () => {
  const { subModuleName } = useParams()

  const routeToComponent = {
    consejos: CouncilEditView,
    carreras: CareersEditView,
    funcionarios: FunctionaryEditView,
  }

  const defaultComponent = () => <div>DEFAULT</div>

  const matchedRoute = Object.keys(routeToComponent).find((key) =>
    RegExp(key).test(subModuleName as string),
  )

  const Component =
    routeToComponent[matchedRoute as keyof typeof routeToComponent] ||
    defaultComponent

  return <Component />
}

export default Page
