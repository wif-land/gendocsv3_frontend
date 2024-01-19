'use client'
import { useParams } from 'next/navigation'
import TemplateView from '../../../../../features/templates/presentation/components/TemplatesView'
import CouncilDetailsView from '../../../../../features/council/presentation/view/council-detail-view'
import { CareerDetailView } from '../../../../../features/careers/presentation/view'

const Page = () => {
  const { subModuleName, id } = useParams()

  const resolveViewBySubModule = () => {
    switch (subModuleName as string) {
      case 'procesos':
        return <TemplateView processId={id as string} />
      case 'consejos':
        return <CouncilDetailsView />
      case 'carreras':
        return <CareerDetailView />
      default:
        return <div>DEFAULT</div>
    }
  }
  return resolveViewBySubModule()
}

export default Page
