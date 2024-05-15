'use client'
import DocumentVisualizer from '../../../../../../shared/sdk/document-visualizer/document-visualizer'
import { useParams, usePathname } from 'next/navigation'

const Page = () => {
  const { driveId } = useParams()
  const returnLink = usePathname().substring(0, usePathname().lastIndexOf('/'))

  return (
    <DocumentVisualizer driveId={driveId as string} returnLink={returnLink} />
  )
}

export default Page
