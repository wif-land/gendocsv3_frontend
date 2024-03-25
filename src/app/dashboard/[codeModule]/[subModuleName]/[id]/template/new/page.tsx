'use client'

import TemplateCreateView from '../../../../../../../features/templates/presentation/view/TemplateCreateView'
import { useParams } from 'next/navigation'

const Page = () => {
  const { codeModule, subModuleName, id } = useParams()

  const route = `${codeModule}/${subModuleName}/template/${id}/new`

  const routeToComponent = {
    template: TemplateCreateView,
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
