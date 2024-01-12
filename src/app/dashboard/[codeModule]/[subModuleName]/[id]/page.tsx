'use client'
import { useParams } from 'next/navigation'
import TemplateView from '../../../../../features/templates/presentation/components/TemplatesView'

const Page = () => {
  const { subModuleName, id } = useParams()

  const resolveViewBySubModule = () => {
    switch (subModuleName as string) {
      case 'procesos':
        return <TemplateView processId={id as string} />
      default:
        return <div>DEFAULT</div>
    }
  }
  return resolveViewBySubModule()
}

export default Page
