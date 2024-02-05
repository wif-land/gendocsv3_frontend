/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Drawer from '@mui/material/Drawer'
import { NAV } from '../config-layout'
import { NavToggleButton, NavUpgrade } from '../_common'
import { usePathname } from 'next/navigation'
import { useResponsive } from '../../../shared/hooks/use-responsive'
import Scrollbar from '../../../shared/sdk/scrollbar'
import Logo from '../../../shared/sdk/logo'
import NavSectionVertical from '../../../shared/sdk/nav-section/vertical/nav-section-vertical'

type Props = {
  openNav: boolean
  onCloseNav: VoidFunction
  navData: any
}

export default function NavVertical({ openNav, onCloseNav, navData }: Props) {
  const pathname = usePathname()

  const lgUp = useResponsive('up', 'lg')

  useEffect(() => {
    if (openNav) {
      onCloseNav()
    }
  }, [pathname])

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />

      <NavSectionVertical
        data={navData}
        config={{
          currentRole: 'admin',
        }}
      />

      <Box sx={{ flexGrow: 1 }} />

      <NavUpgrade />
    </Scrollbar>
  )

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  )
}
