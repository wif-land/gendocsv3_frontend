'use client'

import { memo, useEffect } from 'react'
import Container from '@mui/material/Container'
import { useParams } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { Divider } from '@mui/material'
import { DegreeCertificateDetailsSummary } from '../components/DegreeCertificateDetailSummary'
import { DegreeCertificateDetailAttendance } from '../components/DegreeCertificateDetailAttendance'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'

const DegreeCertificateDetailsView = () => {
  const { id } = useParams()
  const settings = useSettingsContext()
  const { degreeCertificate, getDegreeCertificate } =
    useDegreeCertificateStore()

  useEffect(() => {
    getDegreeCertificate(Number(id))
  }, [id])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={'Acta de grado'}
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'Acta de grado', href: '/' },
          { name: 'Detalle' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DegreeCertificateDetailsSummary
        degreeCertificate={degreeCertificate}
        degreeCertificateId={Number(id)}
      />

      <Divider sx={{ my: 3 }} />

      <DegreeCertificateDetailAttendance
        members={degreeCertificate.members || []}
      />
    </Container>
  )
}

export default memo(DegreeCertificateDetailsView)
