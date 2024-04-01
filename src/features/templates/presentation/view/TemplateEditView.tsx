'use client'

import { memo } from 'react'
import { useParams, usePathname } from 'next/navigation'

import Container from '@mui/material/Container'

import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { useSettingsContext } from '../../../../shared/sdk/settings'

import { TemplateNewEditForm } from '../components/TemplateCreateEditForm'
import { useProcessStore } from '../../../processes/presentation/state/useProcessStore'

const TemplateEditView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()
  const params = useParams()

  const { id, templateId } = params

  const { processes } = useProcessStore()

  const currentProcess = processes?.find((process) => process.id! === +id)

  const templates = currentProcess?.templateProcesses

  console.log('templates', templates)
  const currentTemplate = templates?.find(
    (template) => template.id === +templateId,
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Edita la plantilla ${currentTemplate?.name}`}
        links={[
          {
            name: 'Plantillas',
            href: pathname.replace(`template/${templateId}/edit`, ''),
          },
          { name: 'Editar plantilla' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TemplateNewEditForm currentTemplate={currentTemplate} />
    </Container>
  )
}

export default memo(TemplateEditView)
