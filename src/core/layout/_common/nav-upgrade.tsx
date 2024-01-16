import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useMockedUser } from '../../../shared/hooks/use-mocked-user'

export default function NavUpgrade() {
  const { user } = useMockedUser()

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
            alt={user?.displayName}
            sx={{ width: 48, height: 48 }}
          />
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
