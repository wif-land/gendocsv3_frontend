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
import { useMigrateProcess } from '../hooks/useMigrateProcess'
import { useAccountStore } from '../../../../features/auth/presentation/state/useAccountStore'

interface ConfirmMigrationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (
    templateIds: number[],
    userId: number,
    moduleId: number,
    processValue: string | number,
  ) => void
  selectedItems: string[]
  moduleId: number
}

const ConfirmMigrationDialog: React.FC<ConfirmMigrationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  selectedItems,
  moduleId,
}) => {
  const [isNewProcess, setIsNewProcess] = useState(false)
  const [processName, setProcessName] = useState('')
  const [selectedProcess, setSelectedProcess] = useState<number>()
  const { user } = useAccountStore()

  const { processes, setInputValue, loading, isOpen } =
    useMigrateProcess(moduleId)

  const handleConfirm = () => {
    const processValue = isNewProcess ? processName : Number(selectedProcess)
    onConfirm(
      selectedItems.map((id) => Number(id)),
      user?.id as number,
      moduleId,
      processValue,
    )
    onClose()
  }

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
            options={processes.map((process) => ({
              label: process.name,
              id: process.id,
            }))}
            onChange={(event, newValue) =>
              setSelectedProcess(Number(newValue?.id))
            }
            loading={loading}
            open={isOpen.value}
            onOpen={isOpen.onTrue}
            onClose={() => {
              isOpen.onFalse()
              setInputValue('')
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue)
            }}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <li {...props} key={props.id}>
                {option.label}
              </li>
            )}
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
