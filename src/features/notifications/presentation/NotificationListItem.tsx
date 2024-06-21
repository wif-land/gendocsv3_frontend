import { fToNow } from '../../../core/utils/format-time'
import { ListItemText, Stack, Box } from '@mui/material'
import { INotification } from '../data/entities/INotification'
import { NotificationStatus } from '../utils/notification-status'
import Label from '../../../shared/sdk/label'
import uuidv4 from '../../../core/utils/uuidv4'

type NotificationItemProps = {
  notification: INotification
}

export const NotificationListItem = ({
  notification,
}: NotificationItemProps) => {
  const renderText = (
    <ListItemText
      key={notification.id + notification.name}
      disableTypography
      primary={reader(notification.name)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notification.createdAt)}
        </Stack>
      }
    />
  )

  const renderUnReadBadge = notification.status ===
    NotificationStatus.FAILURE && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.error',
        position: 'absolute',
      }}
    />
  )

  const statusAction = (status: NotificationStatus) => (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
      {status === NotificationStatus.IN_PROGRESS && (
        <Label variant="outlined" color="primary">
          En progreso
        </Label>
      )}
      {status === NotificationStatus.COMPLETED && (
        <Label variant="outlined" color="success">
          Completo
        </Label>
      )}
      {status === NotificationStatus.WITH_ERRORS && (
        <Label variant="outlined" color="warning">
          Con errores
        </Label>
      )}
      {status === NotificationStatus.FAILURE && (
        <Label variant="outlined" color="error">
          Fallido
        </Label>
      )}
    </Stack>
  )

  return (
    <>
      <Stack
        key={uuidv4()}
        sx={{
          p: 2.5,
          width: '100%',
          alignItems: 'flex-start',
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        {renderUnReadBadge}

        <Stack sx={{ alignItems: 'flex-start' }}>
          {renderText}
          {statusAction(notification.status)}
          {notification.messages?.map((message, index) => (
            <Box key={uuidv4()} sx={{ mt: 1 }}>
              <ListItemText
                key={index + notification.id}
                disableTypography
                inset
                primary={`- ${message} `}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </>
  )
}

const reader = (data: string) => (
  <Box
    dangerouslySetInnerHTML={{ __html: data }}
    sx={{
      mb: 0.5,
      '& p': { typography: 'body2', m: 0 },
      '& a': { color: 'inherit', textDecoration: 'none' },
      '& strong': { typography: 'subtitle2' },
      fontSize: '1.2rem',
      fontWeight: 500,
      textDecoration: '',
    }}
  />
)
