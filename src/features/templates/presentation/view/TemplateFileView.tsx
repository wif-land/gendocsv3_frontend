'use client'

import { memo } from 'react'
import { useParams, usePathname } from 'next/navigation'

import { useProcessStore } from '../../../processes/presentation/state/useProcessStore'
import DocumentVisualizer from '../../../../shared/sdk/document-visualizer/document-visualizer'

const TemplateFileView = () => {
  const params = useParams()
  const pathName = usePathname()

  const { id, templateId } = params

  const { processes } = useProcessStore()

  const currentProcess = processes?.find((process) => process.id! === +id)

  const templates = currentProcess?.templateProcesses

  const currentTemplate = templates?.find(
    (template) => template.id === +templateId,
  )

  return (
    <DocumentVisualizer
      driveId={currentTemplate?.driveId as string}
      returnLink={pathName.split('/').slice(0, -2).join('/')}
    />
  )
}

export default memo(TemplateFileView)
