'use client'

import { memo } from 'react'
import { useParams, usePathname } from 'next/navigation'

import Container from '@mui/material/Container'

import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { useSettingsContext } from '../../../../shared/sdk/settings'

import { TemplateNewEditForm } from '../components/TemplateCreateEditForm'
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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <frame src="https://www.youtube.com/embed/1y_kfWUCFDQ" />
    </Container>
  )
}

export default memo(TemplateFileView)
