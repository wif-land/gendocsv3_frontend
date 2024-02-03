'use client'

import Container from '@mui/material/Container'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { usePathname } from 'next/navigation'
import CouncilNewEditForm from '../components/CouncilNewEditForm'
import { memo } from 'react'

const CouncilCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crear un nuevo consejo"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Consejos',
            href: pathname.replace('/new', ''),
          },
          { name: 'Nuevo consejo' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CouncilNewEditForm />
    </Container>
  )
}

export default memo(CouncilCreateView)
