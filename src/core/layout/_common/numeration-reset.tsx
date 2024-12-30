'use client'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'

interface Props extends DialogProps {
  open: boolean
  onClose: VoidFunction
}

const NumerationResetDialog = ({ open, onClose, ...other }: Props) => {
  const [agreeInfo, setAgreeInfo] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showConfirmation && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    if (countdown === 0) {
      setIsButtonDisabled(false)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [showConfirmation, countdown])

  const handleReset = () => {
    if (!showConfirmation) {
      setShowConfirmation(true)
      setIsButtonDisabled(true)
      setCountdown(5)
      return
    }
    // Add your actual reset logic here
    console.log('Numeración reiniciada')
    setShowConfirmation(false)
    setCountdown(5)
    setIsButtonDisabled(true)
    onClose()
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setCountdown(5)
    setIsButtonDisabled(true)
    onClose()
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleCancel}
      {...other}
    >
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        <Typography variant="h3" component="div">
          {showConfirmation
            ? 'Confirmar Reinicio'
            : 'Reinicio de numeración anual'}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {!showConfirmation ? (
          <>
            <h2>¿En que consiste?</h2>
            <p>
              Al reiniciar la numeración anual, se encerarán los números para
              los documentos generados en cada módulo del sistema, tanto para
              consejos y para actas de grado{' '}
            </p>
            <h2>¿Qué verificará el reinicio de numeración?</h2>
            <p>
              Al reiniciar la numeración anual, se verificará que no existan que
              todos los consejos y actas de grado hayan sido cerrados y y que
              los números reservados y encolados hayan sido utilizados
            </p>
            <h2>Recomendaciones:</h2>
            <p>
              <ul>
                <li>
                  Realizar el reinicio de numeración una vez que se haya
                  finalizado el año académico y se haya verificado que todos los
                  documentos han sido generados
                </li>
                <li>Verificar que todos los documentos han sido cerrados</li>
                <li>
                  Verificar que los números reservados y encolados han sido
                  utilizados
                </li>
                <li>
                  Verificar que los consejos y actas de grado se encuentran
                  cerrados
                </li>
                <strong>
                  <li>
                    Se recomienda que todos los usuarios excepto el
                    administrador del sistema estén fuera del sistema
                  </li>
                </strong>
              </ul>
            </p>
            <h2>¿Está seguro de realizar el reinicio de numeración?</h2>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Checkbox
                checked={agreeInfo}
                onChange={(e) => setAgreeInfo(e.target.checked)}
                color="primary"
              />
              <p>He leído y entendido la información</p>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" gutterBottom>
              ¿Está completamente seguro de reiniciar la numeración?
            </Typography>
            <Typography color="warning.main" sx={{ mt: 2 }}>
              Esta acción no se puede deshacer
            </Typography>
            <Typography sx={{ mt: 2 }}>
              El botón se habilitará en {countdown} segundos
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleCancel}>
          Cancelar
        </Button>
        {(agreeInfo || showConfirmation) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleReset}
            disabled={showConfirmation && isButtonDisabled}
          >
            {showConfirmation ? 'Confirmar Reinicio' : 'Reiniciar Numeración'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default NumerationResetDialog
