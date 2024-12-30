'use client'
import React, { useCallback, useState } from 'react'
import { Grid, Typography, Container, Tabs, Tab } from '@mui/material'
import Iconify from '../../../../core/iconify'
import { ReserveNumerationForm } from '../components/ReserveNumerationForm'
import { ExtendNumerationForm } from '../components/ExtendNumerationForm'

export const ReserveNumerationView = () => {
  const [currentTab, setCurrentTab] = useState('reservar')

  const handleChangeTab = useCallback(
    (_: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue)
    },
    [],
  )

  const TABS = [
    {
      value: 'reservar',
      label: 'Reservar',
      icon: <Iconify icon="carbon:stack-limitation" width={24} />,
    },
    {
      value: 'extender',
      label: 'Extender',
      icon: <Iconify icon="ri:expand-width-fill" width={24} />,
    },
  ]

  const renderTabs = (
    <>
      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ p: 2 }}>
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>
    </>
  )

  const renderDetails = (
    <>
      <Grid md={4} item>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Detalles
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Se elije el consejo, proceso, plantilla y numeración del documento
        </Typography>
      </Grid>

      <Grid xs={12} md={8} item>
        {renderTabs}
        {currentTab === 'reservar' ? (
          <ReserveNumerationForm />
        ) : (
          <ExtendNumerationForm />
        )}
      </Grid>
    </>
  )

  return (
    <Container>
      <Grid
        container
        spacing={3}
        sx={{
          mt: 3,
        }}
        item
      >
        {renderDetails}
      </Grid>
    </Container>
  )
}
