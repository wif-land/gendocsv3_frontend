'use client'

import { m } from 'framer-motion'
import { useState, useCallback } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Badge from '@mui/material/Badge'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import NotificationItem from './notification-item'
import { useBoolean } from '../../../../shared/hooks/use-boolean'
import { useResponsive } from '../../../../shared/hooks/use-responsive'
import Iconify from '../../../iconify'
import Label from '../../../../shared/sdk/label'
import Scrollbar from '../../../../shared/sdk/scrollbar'
import { varHover } from '../../../../shared/sdk/animate'
import { useNotificationStore } from '../../../../features/notifications/store/useNotificationStore'
import {
  NotificationStatus,
  notificationStatusColor,
} from '../../../../features/notifications/utils/notification-status'

//iterar en los elementos de un enum
const TABS = Object.values(NotificationStatus).map((value) => ({
  value,
  label: value,
  count: 0,
}))

export default function NotificationsPopover() {
  const drawer = useBoolean()

  const [currentTab, setCurrentTab] = useState(NotificationStatus.COMPLETED)

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue as NotificationStatus)
    },
    [],
  )

  const { notifications } = useNotificationStore()

  if (!notifications || !notifications.length) {
    return (
      <Tooltip title="No hay notificaciones">
        <IconButton>
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </IconButton>
      </Tooltip>
    )
  }

  const totalCompleted = notifications.filter(
    (item) => item.notification.status === NotificationStatus.COMPLETED,
  ).length

  const totalWithErrors = notifications.filter(
    (item) => item.notification.status === NotificationStatus.WITH_ERRORS,
  ).length

  const totalProcessing = notifications.filter(
    (item) => item.notification.status === NotificationStatus.IN_PROGRESS,
  ).length

  const totalFailed = notifications.filter(
    (item) => item.notification.status === NotificationStatus.FAILURE,
  ).length

  TABS[0].count = totalProcessing
  TABS[1].count = totalCompleted
  TABS[2].count = totalWithErrors
  TABS[3].count = totalFailed

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notificaciones
      </Typography>
    </Stack>
  )

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={
                ((tab.value === NotificationStatus.COMPLETED ||
                  tab.value === currentTab) &&
                  'filled') ||
                'soft'
              }
              color={notificationStatusColor(tab.value)}
            >
              {tab.count}
            </Label>
          }
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  )

  const renderList = (currentTab: string) => (
    <Scrollbar>
      <List disablePadding>
        {notifications
          .filter(
            (notification) => notification.notification.status === currentTab,
          )
          .map((notification) => (
            <NotificationItem
              key={notification.notification.id}
              rootNotification={notification}
            />
          ))}
      </List>
    </Scrollbar>
  )

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalFailed || 'o'} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          {/* <IconButton onClick={() => {}}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton> */}
        </Stack>

        <Divider />

        {renderList(currentTab)}
      </Drawer>
    </>
  )
}
