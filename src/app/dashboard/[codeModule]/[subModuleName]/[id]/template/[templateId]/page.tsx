'use client'

import TemplateFileView from '../../../../../../../features/templates/presentation/view/TemplateFileView'
import { useParams } from 'next/navigation'

const Page = () => {
  const { codeModule, subModuleName, id } = useParams()

  const route = `${codeModule}/${subModuleName}/template/${id}`

  const routeToComponent = {
    template: TemplateFileView,
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
