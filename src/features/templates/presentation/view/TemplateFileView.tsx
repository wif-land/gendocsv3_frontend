'use client'

import { memo } from 'react'
import { useParams } from 'next/navigation'

import Container from '@mui/material/Container'

import { useSettingsContext } from '../../../../shared/sdk/settings'

import { useProcessStore } from '../../../processes/presentation/state/useProcessStore'

const TemplateFileView = () => {
  const settings = useSettingsContext()
  const params = useParams()

  const { id, templateId } = params

  const { processes } = useProcessStore()

  const currentProcess = processes?.find((process) => process.id! === +id)

  const templates = currentProcess?.templateProcesses

  const currentTemplate = templates?.find(
    (template) => template.id === +templateId,
  )
  const documentURL = `https://docs.google.com/document/d/${currentTemplate?.driveId}/edit?usp=sharing`

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <iframe src={documentURL} width="100%" height="1000px" />
    </Container>
  )
}

export default memo(TemplateFileView)
