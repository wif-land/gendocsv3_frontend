'use client'

import Container from '@mui/material/Container'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import { useParams } from 'next/navigation'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { paths } from '../../../../core/routes/paths'
import { DegreeCertificateNewEditForm } from '../components/DegreeCertificateNewEditForm'
import { memo } from 'react'

const DegreeCertificateEditView = () => {
  const settings = useSettingsContext()
  const { id } = useParams()
  const { degreeCertificates } = useDegreeCertificatesStore()

  const currentDegreeCertificate = degreeCertificates.find(
    (degree) => degree.id! === +id,
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Actas de grado',
            href: `${window.location.href.replace(/\/\d+\/edit/, '')}`,
          },
          { name: currentDegreeCertificate?.topic || 'Editar' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DegreeCertificateNewEditForm
        currentDegreeCertificate={currentDegreeCertificate}
      />
    </Container>
  )
}

export default memo(DegreeCertificateEditView)
