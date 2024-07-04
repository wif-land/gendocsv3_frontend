import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material'

interface ConfirmMigrationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (selectedItems: string[], processValue: string) => void
  selectedItems: string[]
}

const ConfirmMigrationDialog: React.FC<ConfirmMigrationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  selectedItems,
}) => {
  const [isNewProcess, setIsNewProcess] = useState(false)
  const [processName, setProcessName] = useState('')
  const [selectedProcess, setSelectedProcess] = useState('')

  const handleConfirm = () => {
    const processValue = isNewProcess ? processName : selectedProcess
    onConfirm(selectedItems, processValue)
    onClose()
  }

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
  ]

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Migrar plantillas</DialogTitle>
      <DialogContent
        sx={{
          paddingLeft: 4,
          paddingRight: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <div>
          Estás seguro de que quieres migrar
          <strong> {selectedItems.length} </strong> item(s)?
        </div>
        {isNewProcess ? (
          <TextField
            id="process-name"
            label="Proceso"
            variant="outlined"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
          />
        ) : (
          <Autocomplete
            disablePortal
            id="process-id"
            options={top100Films}
            onChange={(event, newValue) =>
              setSelectedProcess(newValue?.label || '')
            }
            renderInput={(params) => <TextField {...params} label="Proceso" />}
          />
        )}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={isNewProcess}
                onChange={(e) => setIsNewProcess(e.target.checked)}
              />
            }
            label="Nuevo proceso"
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="info" onClick={handleConfirm}>
          Migrar
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmMigrationDialog
