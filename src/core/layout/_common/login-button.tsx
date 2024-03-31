import { Theme, SxProps } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { paths } from '../../routes/paths'
import { RouterLink } from '../../routes/components'

type Props = {
  sx?: SxProps<Theme>
}

export default function LoginButton({ sx }: Props) {
  return (
    <Button
      component={RouterLink}
      href={paths.auth.login}
      variant="outlined"
      sx={{ mr: 1, ...sx }}
    >
      Login
    </Button>
  )
}
