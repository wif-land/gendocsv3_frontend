'use client'
import { useParams } from 'next/navigation'

const Page = () => {
  const { subModuleName, id } = useParams()

  const resolveViewBySubModule = () => {
    switch (subModuleName as string) {
      case 'procesos':
        return <p>soy un proceso dinámico con id {id}</p>

      default:
        return <div>DEFAULT</div>
    }
  }
  return resolveViewBySubModule()
}

export default Page
