import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { NAV } from '../config-layout'
import { useNavConfig } from './useNavConfig'
import { NavToggleButton } from '../_common'
import Logo from '../../../shared/sdk/logo'
import NavSectionMini from '../../../shared/sdk/nav-section/mini/nav-section-mini'
import { hideScroll } from '../../theme/css'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'

export default function NavMini() {
  const { user } = useAccountStore()
  const navData = useNavConfig()

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini
          data={navData}
          config={{
            currentRole: user?.role || 'admin',
          }}
        />
      </Stack>
    </Box>
  )
}
