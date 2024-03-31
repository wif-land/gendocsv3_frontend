import { useTheme } from '@mui/material/styles'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { NAV } from '../config-layout'
import { useSettingsContext } from '../../../shared/sdk/settings'
import { useResponsive } from '../../../shared/hooks/use-responsive'
import Iconify from '../../iconify'
import { bgBlur } from '../../theme/css'

export default function NavToggleButton({ sx, ...other }: IconButtonProps) {
  const theme = useTheme()

  const settings = useSettingsContext()

  const lgUp = useResponsive('up', 'lg')

  if (!lgUp) {
    return null
  }

  return (
    <IconButton
      size="small"
      onClick={() =>
        settings.onUpdate(
          'themeLayout',
          settings.themeLayout === 'vertical' ? 'mini' : 'vertical',
        )
      }
      sx={{
        p: 0.5,
        top: 32,
        position: 'fixed',
        left: NAV.W_VERTICAL - 12,
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
        ...sx,
      }}
      {...other}
    >
      <Iconify
        width={16}
        icon={
          settings.themeLayout === 'vertical'
            ? 'eva:arrow-ios-back-fill'
            : 'eva:arrow-ios-forward-fill'
        }
      />
    </IconButton>
  )
}
