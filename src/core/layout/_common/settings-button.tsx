import { Theme, SxProps } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Badge, { badgeClasses } from '@mui/material/Badge'
import { useSettingsContext } from '../../../shared/sdk/settings'
import Iconify from '../../iconify'

type Props = {
  sx?: SxProps<Theme>
}

export default function SettingsButton({ sx }: Props) {
  const settings = useSettingsContext()

  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!settings.canReset}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 8,
        },
        ...sx,
      }}
    >
      <IconButton
        onClick={settings.onToggle}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <Iconify icon="solar:settings-bold-duotone" width={24} />
      </IconButton>
    </Badge>
  )
}
