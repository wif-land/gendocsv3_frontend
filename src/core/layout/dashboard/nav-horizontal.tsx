/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { HEADER } from '../config-layout'
import { HeaderShadow } from '../_common'
import { bgBlur } from '../../theme/css'
import NavSectionHorizontal from '../../../shared/sdk/nav-section/horizontal/nav-section-horizontal'

const NavHorizontal = ({ navData }: { navData: any }) => {
  const theme = useTheme()

  return (
    <AppBar
      component="nav"
      sx={{
        top: HEADER.H_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal
          data={navData}
          config={{
            currentRole: 'admin',
          }}
        />
      </Toolbar>

      <HeaderShadow />
    </AppBar>
  )
}

export default memo(NavHorizontal)
