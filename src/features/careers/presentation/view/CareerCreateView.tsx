'use client'

import Container from '@mui/material/Container'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { paths } from '../../../../core/routes/paths'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { CareerNewEditForm } from '../components/CareerNewEditForm'

const CareerCreateView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Crea una nueva carrera"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Carreras',
            href: pathname.replace('/new', ''),
          },
          { name: 'Nueva Carrera' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CareerNewEditForm />
    </Container>
  )
}

export default memo(CareerCreateView)
