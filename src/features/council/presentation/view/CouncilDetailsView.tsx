'use client'

import { useCallback, useState } from 'react'
import { alpha } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
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
import { useUsersStore } from '../../../../shared/store/usersStore'
import { format } from 'date-fns'

export default function CouncilDetailsView() {
  const { id } = useParams()
  const router = useRouter()

  const settings = useSettingsContext()

  const { councils } = useCouncilStore()
  const { users } = useUsersStore()
  const council = councils.find((council) => council.id! === +id)
  const user = users?.find((user) => user.id === council?.userId)

  const SUMMARY = [
    {
      title: 'Creado por',
      value: `${user?.firstName} ${user?.firstLastName}` || '',
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
    {
      title: 'Asistentes',
      value: council?.attendance.length,
      icon: 'eva:people-outline',
    },
    {
      title: 'Estado',
      value: council?.isActive ? 'Activo' : 'Inactivo',
      icon: 'eva:checkmark-circle-2-outline',
    },
  ]

  const [currentTab, setCurrentTab] = useState('description')

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue)
    },
    [],
  )

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

  const renderProduct = council && (
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
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) =>
              `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          //TODO: council.attendance should be council.attendees and should be
          //an array of objects with the info of the attendees
          {council.attendance.map((attendee, index) => (
            <Tab key={index} value={1} label={'Información del asistente'} />
          ))}
        </Tabs>

        {/* {currentTab === 'description' && (
          <ProductDetailsDescription description={'una buena descripcion'} />
        )} */}
      </Card>
    </>
  )

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {false ? renderSkeleton : <>{false ? renderError : renderProduct}</>}
      {!council && renderError}
    </Container>
  )
}
