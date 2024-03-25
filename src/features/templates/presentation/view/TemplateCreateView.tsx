'use client'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

import Container from '@mui/material/Container'

import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { useSettingsContext } from '../../../../shared/sdk/settings'

import { TemplateNewEditForm } from '../components/TemplateCreateEditForm'

const TemplateCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crea una nueva plantilla"
        links={[
          {
            name: 'Plantillas',
            href: pathname.replace('template/new', ''),
          },
          { name: 'Nueva plantilla' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TemplateNewEditForm />
    </Container>
  )
}

export default memo(TemplateCreateView)
