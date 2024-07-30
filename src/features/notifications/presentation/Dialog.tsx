/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog, { DialogProps } from '@mui/material/Dialog'

import { List, Stack, Tab, Tabs } from '@mui/material'
import { IRootNotification } from '../data/entities/IRootNotification'
import { NotificationListItem } from './NotificationListItem'
import { useCallback, useState } from 'react'
import Label from '../../../shared/sdk/label'
import Scrollbar from '../../../shared/sdk/scrollbar'
import {
  NotificationStatus,
  notificationStatusColor,
} from '../utils/notification-status'
import uuidv4 from '../../../core/utils/uuidv4'

interface Props extends DialogProps {
  onCreate?: VoidFunction
  onUpdate?: VoidFunction
  open: boolean
  onClose: VoidFunction
  rootNotification?: IRootNotification
}

export const NotificationDetailsDialog = ({
  open,
  onClose,
  rootNotification,
  ...other
}: Props) => {
  const handleOnClose = async () => {
    onClose()
  }

  const [currentTab, setCurrentTab] = useState(NotificationStatus.COMPLETED)

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue as NotificationStatus)
    },
    [],
  )

  const TABS = Object.values(NotificationStatus).map((value) => ({
    value,
    label: value,
    count: 0,
  }))

  const totalCompleted = rootNotification?.childs.filter(
    (item) => item.status === NotificationStatus.COMPLETED,
  ).length

  const totalWithErrors = rootNotification?.childs.filter(
    (item) => item.status === NotificationStatus.WITH_ERRORS,
  ).length

  const totalProcessing = rootNotification?.childs.filter(
    (item) => item.status === NotificationStatus.IN_PROGRESS,
  ).length

  const totalFailed = rootNotification?.childs.filter(
    (item) => item.status === NotificationStatus.FAILURE,
  ).length

  TABS[0].count = totalProcessing || 0
  TABS[1].count = totalCompleted || 0
  TABS[2].count = totalWithErrors || 0
  TABS[3].count = totalFailed || 0

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
        {rootNotification?.childs
          .filter((notification) => notification.status === currentTab)
          .map((notification) => (
            <NotificationListItem key={uuidv4()} notification={notification} />
          ))}
      </List>
    </Scrollbar>
  )

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        <Stack>{rootNotification?.notification?.name}</Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {renderTabs}
        {renderList(currentTab)}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleOnClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
