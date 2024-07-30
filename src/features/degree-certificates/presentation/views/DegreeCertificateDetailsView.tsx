'use client'

import { memo, useEffect } from 'react'
import Container from '@mui/material/Container'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { Divider } from '@mui/material'
import { DegreeDetailsSummary } from '../components/DegreeDetailSummary'
import { DegreeAttendanceDetails } from '../components/DegreeAttendanceDetails'
import { useDegreeCertificateStore } from '../store/useDegreeCertificateStore'

const DegreeCertificateDetailsView = () => {
  const { id } = useParams()
  const settings = useSettingsContext()
  const { degreeCertificate, getDegreeCertificate } =
    useDegreeCertificateStore()
  const pathname = usePathname()
  const searParams = useSearchParams()

  useEffect(() => {
    getDegreeCertificate(Number(id))
  }, [id])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={'Acta de grado'}
        links={[
          { name: 'Dashboard', href: '/' },
          {
            name: 'Acta de grado',
            href: `${pathname.replace(`/${id}`, '')}?${searParams.toString()}`,
          },
          { name: 'Detalle' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DegreeDetailsSummary
        degreeCertificate={degreeCertificate}
        degreeCertificateId={Number(id)}
      />

      <Divider sx={{ my: 3 }} />

      <DegreeAttendanceDetails />
    </Container>
  )
}

export default memo(DegreeCertificateDetailsView)
