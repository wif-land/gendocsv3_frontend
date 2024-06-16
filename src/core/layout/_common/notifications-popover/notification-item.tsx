import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import { fToNow } from '../../../utils/format-time'
import { useState } from 'react'
import { NotificationDetailsDialog } from '@/features/notifications/presentation/Dialog'
import { IRootNotification } from '@/features/notifications/data/entities/IRootNotification'
import { NotificationStatus } from '@/features/notifications/utils/notification-status'

type NotificationItemProps = {
  rootNotification: IRootNotification
}

export default function NotificationItem({
  rootNotification,
}: NotificationItemProps) {
  const [open, isOpen] = useState(false)

  const onClose = () => {
    isOpen(false)
  }
  // const renderAvatar = (
  //   <ListItemAvatar>
  //     {notification.avatarUrl ? (
  //       <Avatar
  //         src={notification.avatarUrl}
  //         sx={{ bgcolor: 'background.neutral' }}
  //       />
  //     ) : (
  //       <Stack
  //         alignItems="center"
  //         justifyContent="center"
  //         sx={{
  //           width: 40,
  //           height: 40,
  //           borderRadius: '50%',
  //           bgcolor: 'background.neutral',
  //         }}
  //       >
  //         <Box
  //           component="img"
  //           src={`/assets/icons/notification/${
  //             (notification.type === 'order' && 'ic_order') ||
  //             (notification.type === 'chat' && 'ic_chat') ||
  //             (notification.type === 'mail' && 'ic_mail') ||
  //             (notification.type === 'delivery' && 'ic_delivery')
  //           }.svg`}
  //           sx={{ width: 24, height: 24 }}
  //         />
  //       </Stack>
  //     )}
  //   </ListItemAvatar>
  // )

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(rootNotification.notification.name)}
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
          {fToNow(rootNotification.notification.createdAt)}
          {rootNotification.notification.status}
        </Stack>
      }
    />
  )

  const renderUnReadBadge = rootNotification.notification.status ==
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

  return (
    <>
      <NotificationDetailsDialog
        open={open}
        onClose={onClose}
        rootNotification={rootNotification}
      />
      <ListItemButton
        disableRipple
        sx={{
          p: 2.5,
          alignItems: 'flex-start',
          borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
        onClick={() => isOpen(true)}
      >
        {renderUnReadBadge}

        {/* {renderAvatar} */}

        <Stack sx={{ flexGrow: 1 }}>{renderText}</Stack>
      </ListItemButton>
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
    }}
  />
)
