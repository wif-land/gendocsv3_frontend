'use client'

import { useParams } from 'next/navigation'

import CouncilEditView from '../../../../../../features/council/presentation/view/CouncilEditView'

const Page = () => {
  const { subModuleName } = useParams()

  const resolveViewBySubModule = () => {
    switch (subModuleName as string) {
      case 'consejos':
        return <CouncilEditView />
      default:
        return <div>DEFAULT</div>
    }
  }
  return resolveViewBySubModule()
}

export default Page
