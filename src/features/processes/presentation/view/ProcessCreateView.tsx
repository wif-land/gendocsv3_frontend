'use client'

import Container from '@mui/material/Container'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { paths } from '../../../../core/routes/paths'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { ProcessNewEditForm } from '../components/ProcessCreateEditForm'

const ProcessCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crea un nuevo proceso"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Procesos',
            href: pathname.replace('/new', ''),
          },
          { name: 'Nuevo proceso' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProcessNewEditForm />
    </Container>
  )
}

export default memo(ProcessCreateView)
