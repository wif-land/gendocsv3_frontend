'use client'

import { memo, useCallback, useState } from 'react'
import { alpha } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import { useParams, useRouter } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import EmptyContent from '../../../../shared/sdk/empty-content/empty-content'
import Iconify from '../../../../core/iconify'
import { useCareersStore } from '../state/careerStore'
import { CareerDetailsSummary } from '../components/CareerDetailsSummary'
import { CareerDetailsSkeleton } from '../components/CareerSkeleton'

const CareerDetailsView = () => {
  const [currentTab, setCurrentTab] = useState('description')
  const { id } = useParams()
  const router = useRouter()
  const settings = useSettingsContext()
  const { careers } = useCareersStore()
  const career = careers.find((council) => council.id! === +id)
  const renderSkeleton = <CareerDetailsSkeleton />

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue)
    },
    [],
  )

  const renderError = (
    <EmptyContent
      filled
      title={`No hay carrera con el id ${id}`}
      action={
        <Button
          onClick={() => router.back()}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Regresar a la lista
        </Button>
      }
      sx={{ py: 10 }}
    />
  )

  const renderCareer = career && (
    <>
      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={5}>
          <CareerDetailsSummary disabledActions career={career} />
        </Grid>
      </Grid>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Descripción',
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Card>
    </>
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {false ? renderSkeleton : <>{false ? renderError : renderCareer}</>}
    </Container>
  )
}

export default memo(CareerDetailsView)
