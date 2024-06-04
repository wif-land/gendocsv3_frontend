'use client'

import { memo, useCallback, useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import Container from '@mui/material/Container'
import { useParams } from 'next/navigation'
import { useSettingsContext } from '../../../../shared/sdk/settings'
import Iconify from '../../../../core/iconify'
import { Tabs } from '@mui/material'
import { CouncilDetailAttendance } from '../components/CouncilDetailAttendance'
import CustomBreadcrumbs from '../../../../shared/sdk/custom-breadcrumbs/custom-breadcrumbs'
import { CouncilDetailsSummary } from '../components/CouncilDetailSummary'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { useCouncilStore } from '../store/councilStore'

const CouncilDetailsView = () => {
  const { id } = useParams()
  const settings = useSettingsContext()
  const [currentTab, setCurrentTab] = useState('general')
  const { council, setCouncil } = useCouncilStore()

  const handleChangeTab = useCallback(
    (_: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue)
    },
    [],
  )

  useEffect(() => {
    CouncilsUseCasesImpl.getInstance()
      .getById(Number(id))
      .then((data) => {
        setCouncil(data)
      })
  }, [id])

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

      {currentTab === 'general' && council && (
        <CouncilDetailsSummary council={council} councilId={Number(id)} />
      )}

      {currentTab === 'attendees' && <CouncilDetailAttendance />}
    </Container>
  )
}

export default memo(CouncilDetailsView)
