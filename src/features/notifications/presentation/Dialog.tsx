/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog, { DialogProps } from '@mui/material/Dialog'

import { Box } from '@mui/material'
import { IRootNotification } from '../data/entities/IRootNotification'
import { NotificationListItem } from './NotificationListItem'

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

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        <h2>{rootNotification?.notification?.name}</h2>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <h3>Detalles:</h3>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {rootNotification?.childs?.map((child) => (
            <NotificationListItem notification={child} />
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleOnClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
