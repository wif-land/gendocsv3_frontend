'use client'

import Container from '@mui/material/Container'
import CustomBreadcrumbs from '../../../../shared/components/custom-breadcrumbs/custom-breadcrumbs'
import { useSettingsContext } from '../../../../shared/components/settings'
import { paths } from '../../../../core/routes/paths'
import { useParams, usePathname } from 'next/navigation'
import { memo } from 'react'
import { CareerNewEditForm } from '../components/CareerNewEditForm'
import { useCareerView } from '../hooks/useCareerView'

const CareerEditView = () => {
  const settings = useSettingsContext()
  const pathname = usePathname()
  const params = useParams()

  const { id } = params

  const { careers } = useCareerView()

  const currentCareer = careers?.find((career) => career.id! === +id)

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
            name: 'Carreras',
            href: pathname.replace(new RegExp(`/${id}/edit`), ''),
          },
          { name: 'Editar Carrera' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CareerNewEditForm currentCareer={currentCareer} />
    </Container>
  )
}

export default memo(CareerEditView)
