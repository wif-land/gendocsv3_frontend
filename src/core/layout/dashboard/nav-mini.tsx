import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { NAV } from '../config-layout'
import { useNavData } from './config-navigation'
import { NavToggleButton } from '../_common'
import Logo from '../../../shared/components/logo'
import NavSectionMini from '../../../shared/components/nav-section/mini/nav-section-mini'
import { hideScroll } from '../../theme/css'
import { useUserStore } from '../../../shared/store/userProfileStore'

export default function NavMini() {
  const { user } = useUserStore()
  const navData = useNavData()

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
            currentRole: (user?.roles as string[])[0] || 'admin',
          }}
        />
      </Stack>
    </Box>
  )
}
