'use client'

import Container from '@mui/material/Container'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { DegreeCertificateNewEditForm } from '../components/DegreeCertificateNewEditForm'
import { CertificateProvider } from '../../../../core/providers/certificate-degree-provider'

const CouncilCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <CertificateProvider>
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
              href: pathname.replace('/new', ''),
            },
            { name: 'Nueva acta' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <DegreeCertificateNewEditForm />
      </Container>
    </CertificateProvider>
  )
}

export default memo(CouncilCreateView)
