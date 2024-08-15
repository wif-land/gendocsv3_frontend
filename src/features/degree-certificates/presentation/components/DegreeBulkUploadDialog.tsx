/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react'

import * as XLSX from 'xlsx'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog, { DialogProps } from '@mui/material/Dialog'

import { Upload } from '../../../../shared/sdk/upload'
import Iconify from '../../../../core/iconify'
import { transformData } from '../constants'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import { useAccountStore } from '../../../auth/presentation/state/useAccountStore'
import { useNotificationStore } from '../../../notifications/store/useNotificationStore'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import { useBoolean } from '../../../../shared/hooks/use-boolean'

interface Props extends DialogProps {
  title?: string
  onCreate?: VoidFunction
  onUpdate?: VoidFunction
  folderName?: string
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void
  open: boolean
  onClose: VoidFunction
}

export interface DegreeCertificateForBulk {
  topic: string
  presentationDate?: Date
  roomId?: number
  duration?: number
  studentDni: string
  certificateType: string
  certificateStatus?: string
  link?: string
  firstMainQualifierDni: string
  secondMainQualifierDni: string
  firstSecondaryQualifierDni?: string
  secondSecondaryQualifierDni?: string
  mentorDni: string
  qualifiersResolution: string
  curriculumGrade: string
  gradesDetails?: string
  changeUniversityResolution?: string
  changeUniversityName?: string
  changeUniversityDate?: string
}

export const DegCerBulkUploadDialog = ({
  title = 'Suba un excel con el formato para actas de grado',
  open,
  onClose,
  ...other
}: Props) => {
  const [files, setFiles] = useState<(File | string)[]>([])
  const isRetry = useBoolean()
  const [retryId, setRetryId] = useState<number | undefined>()
  const [degreeCertificates, setDegreeCertificates] = useState<
    DegreeCertificateForBulk[]
  >([])
  const { bulkLoad } = useDegreeCertificatesStore()
  const { user } = useAccountStore()
  const { notifications } = useNotificationStore()

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFile = acceptedFiles[0]

      if (newFile) {
        setFiles([
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          }),
        ])
      }
    },
    [files],
  )

  const readAsBinaryStringSync = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (evt) => {
        if (evt.target === null) {
          reject(new Error('Error loading file'))
          return
        }
        const bstr = evt.target.result
        resolve(bstr)
      }
      reader.onerror = (_evt) => {
        reject(new Error('Error reading file'))
      }
      reader.readAsBinaryString(file)
    })

  const processFileSynchronously = async (file: string | File) => {
    try {
      const bstr = await readAsBinaryStringSync(file as File)
      const workbook = XLSX.read(bstr, { type: 'binary' })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)
      console.log(data)
      const transformedData = transformData(data)
      setDegreeCertificates(transformedData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpload = async () => {
    await processFileSynchronously(files[0])

    onClose()
  }

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile)
    setFiles(filtered)
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  useEffect(() => {
    if (degreeCertificates.length === 0) {
      return
    }

    if (!isRetry.value) {
      bulkLoad(degreeCertificates, user?.id as number)
      return
    }

    if (retryId) {
      bulkLoad(degreeCertificates, user?.id as number, retryId)
    }
  }, [degreeCertificates])

  useEffect(() => {
    isRetry.onFalse()
    if (!open) {
      setFiles([])
    }
  }, [open])

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        {' '}
        {title}{' '}
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Upload
          multiple
          files={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        />
      </DialogContent>

      <DialogActions
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          placeItems: 'center',
        }}
      >
        <Stack
          spacing={2}
          direction="row"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flex: 1,
          }}
        >
          {notifications?.length > 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  onChange={() => {
                    isRetry.onToggle()
                  }}
                />
              }
              label="Es reintento?"
            />
          )}

          {isRetry.value && (
            <FormControl fullWidth>
              <InputLabel id="notifications">Cargas con error</InputLabel>
              <Select
                labelId="notifications"
                id="notificatoinsSelect"
                value={retryId}
                label="Cargas con error"
                onChange={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (event: any) => {
                    setRetryId(event.target.value)
                  }
                }
              >
                {notifications
                  .filter(
                    (rootNotification) =>
                      rootNotification.notification.type ===
                      'createBulkCertificates',
                  )
                  .map((notification) => (
                    <MenuItem
                      value={notification.notification.id}
                      key={notification.notification.id}
                    >
                      {notification.notification.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
        </Stack>
        <Stack
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: !isRetry.value ? 'row' : 'column',
          }}
        >
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={handleUpload}
          >
            Subir
          </Button>

          {!!files.length && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleRemoveAllFiles}
            >
              Eliminar
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
