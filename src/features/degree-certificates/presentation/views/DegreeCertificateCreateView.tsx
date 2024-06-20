'use client'

import Container from '@mui/material/Container'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { memo } from 'react'
import { DegreeCertificateNewEditForm } from '../components/DegreeCertificateNewEditForm'

const CouncilCreateView = () => {
  const settings = useSettingsContext()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crear una acta de grado"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Actas de Grado',
            href: window.location.href.replace('/new', ''),
          },
          { name: 'Nueva acta' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DegreeCertificateNewEditForm />
    </Container>
  )
}

export default memo(CouncilCreateView)
