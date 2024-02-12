'use client'

import { memo } from 'react'
import { useParams, usePathname } from 'next/navigation'

import Container from '@mui/material/Container'

import { paths } from '../../../../core/routes/paths'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { useSettingsContext } from '../../../../shared/sdk/settings'

import { useProcessStore } from '../state/useProcessStore'
import { ProcessNewEditForm } from '../components/ProcessCreateEditForm'

const ProcessEditView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()
  const params = useParams()

  const { id } = params

  const { processes } = useProcessStore()

  const currentProcess = processes?.find((career) => career.id! === +id)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Procesos',
            href: pathname.replace(new RegExp(`/${id}/edit`), ''),
          },
          { name: 'Editar Proceso' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessNewEditForm currentProcess={currentProcess} />
    </Container>
  )
}

export default memo(ProcessEditView)
