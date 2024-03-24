/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog, { DialogProps } from '@mui/material/Dialog'

import { Box } from '@mui/material'
import { NumerationModel } from '../../data/models/NumerationModel'
import { useDocumentsForm } from '../hooks/useDocumentsForm'

interface Props extends DialogProps {
  onCreate?: VoidFunction
  onUpdate?: VoidFunction
  open: boolean
  onClose: VoidFunction
  numeration?: NumerationModel
}

export const DocumentSeeNumerationDialog = ({
  open,
  onClose,
  numeration,
  ...other
}: Props) => {
  const { methods } = useDocumentsForm()
  const handleUpload = async () => {
    onClose()
  }

  const handleChangeNumber = (number: number) => {
    methods.setValue('number', number)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        Siguiente numeración disponible: {numeration?.nextAvailableNumber}
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <h2>Numeración en cola</h2>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {numeration?.enqueuedNumbers?.map((number, index) => (
            <Box key={index} onClick={() => handleChangeNumber(number)}>
              {number}
            </Box>
          ))}
        </Box>

        <h2>Números reservados</h2>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {numeration?.reservedNumbers?.map((number, index) => (
            <Box key={index} onClick={() => handleChangeNumber(number)}>
              {number}
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleUpload}>
          Cancelar
        </Button>

        <Button variant="contained" onClick={handleUpload}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
