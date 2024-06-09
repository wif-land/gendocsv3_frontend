'use client'

import { memo, useEffect } from 'react'
import Container from '@mui/material/Container'
import { useParams } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { CouncilDetailsSummary } from '../components/CouncilDetailSummary'
import { useCouncilStore } from '../store/councilStore'
import { CouncilDetailAttendance } from '../components/CouncilDetailAttendance'
import { Divider } from '@mui/material'

const CouncilDetailsView = () => {
  const { id } = useParams()
  const settings = useSettingsContext()
  const { council, getCouncil } = useCouncilStore()

  useEffect(() => {
    getCouncil(Number(id))
  }, [id])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={council?.name || 'Cargando...'}
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'Consejo', href: '/' },
          { name: council?.name || 'Cargando...' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CouncilDetailsSummary council={council} councilId={Number(id)} />

      <Divider sx={{ my: 3 }} />

      <CouncilDetailAttendance members={council?.members} />
    </Container>
  )
}

export default memo(CouncilDetailsView)
