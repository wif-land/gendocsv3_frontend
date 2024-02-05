'use client'

import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import Typography from '@mui/material/Typography'
import { useParams, useRouter } from 'next/navigation'
import { useCouncilStore } from '../store/councilsStore'
import { useSettingsContext } from '../../../../shared/components/settings'
import EmptyContent from '../../../../shared/components/empty-content/empty-content'
import { CouncilDetailsSkeleton } from '../components/CouncilSkeleton'
import Iconify from '../../../../core/iconify'
import CouncilDetailsSummary from '../components/CouncilDetailSummary'
import { format } from 'date-fns'
import { useCallback, useState } from 'react'
import CustomBreadcrumbs from '../../../../shared/components/custom-breadcrumbs/custom-breadcrumbs'
import { Tabs } from '@mui/material'
import { CouncilDetailAttendance } from '../components/CouncilDetailAttendance'

export default function CouncilDetailsView() {
  const { id } = useParams()
  const router = useRouter()
  const settings = useSettingsContext()
  const { councils } = useCouncilStore()

  const [currentTab, setCurrentTab] = useState('general')

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue)
    },
    [],
  )

  const council = councils.find((council) => council.id! === +id)

  const TABS = [
    {
      value: 'general',
      label: 'General',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    {
      value: 'attendees',
      label: 'Miembros',
      icon: <Iconify icon="solar:bell-bing-bold" width={24} />,
    },
  ]

  const SUMMARY = [
    {
      title: 'Creado por',
      value: council?.createdBy,
      icon: 'eva:person-outline',
    },
    {
      title: 'Tipo',
      value: `${council?.type === 'ORDINARY' ? 'Ordinaria' : 'Extraordinaria'}`,
      icon: 'eva:calendar-outline',
    },
    {
      title: 'Fecha',
      value: `${
        council?.date !== undefined
          ? format(new Date(council.date), ' dd/MM/yyyy HH:mm ')
          : ''
      }`,
      icon: 'eva:calendar-outline',
    },
  ]

  const renderSkeleton = <CouncilDetailsSkeleton />

  const renderError = (
    <EmptyContent
      filled
      title={`No hay consejo con el id ${id}`}
      action={
        <Button
          onClick={() => router.back()}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Regresar
        </Button>
      }
      sx={{ py: 10 }}
    />
  )

  const renderAttendees = council && (
    <>
      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={5}>
          <CouncilDetailsSummary disabledActions council={council} />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={40} />
            <Typography variant="h4" color="text.secondary">
              {item.title}
            </Typography>
            <Typography variant="h6">{item.value}</Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="h4" sx={{ mb: 3 }}>
        Asistentes
      </Typography>

      <Card>
        {council.attendees.map((attendee, index) => (
          <Tab key={index} value={1} label={'Información del asistente'} />
        ))}
      </Card>
    </>
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Consejo"
        links={[
          { name: 'Dashboard', href: '/' },
          { name: 'Consejo', href: '/' },
          { name: council?.name || 'Cargando...' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      {currentTab === 'general' && <CouncilDetailsSummary council={council!} />}

      {currentTab === 'asistencia' && <CouncilDetailAttendance />}
    </Container>
  )
}
