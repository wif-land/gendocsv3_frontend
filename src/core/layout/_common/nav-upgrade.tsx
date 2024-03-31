import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useAccountStore } from '../../../features/auth/presentation/state/useAccountStore'

export default function NavUpgrade() {
  const { user } = useAccountStore()

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={''}
            alt={`${user?.firstName} ${user?.firstLastName}`}
            sx={{ width: 48, height: 48 }}
          />
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.firstName} {user?.firstLastName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.googleEmail}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
