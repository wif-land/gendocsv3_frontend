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
import { useCareersStore } from '../../../careers/presentation/store/careerStore'
import { useLocations } from '../../../../core/providers/locations-provider'
import { enqueueSnackbar } from 'notistack'
import { MenuItem, Select } from '@mui/material'
import { IFunctionary } from '../../domain/entities/IFunctionary'
import { useFunctionaryMethods } from '../hooks/useFunctionaryMethods'

interface Props extends DialogProps {
  title?: string
  onCreate?: VoidFunction
  onUpdate?: VoidFunction
  folderName?: string
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void
  open: boolean
  onClose: VoidFunction
}

export const FuntionaryBulkUploadDialog = ({
  title = 'Sube un excel con los datos de los funcionarios',
  open,
  onClose,
  ...other
}: Props) => {
  const [files, setFiles] = useState<(File | string)[]>([])
  const [students, setStudents] = useState<IFunctionary[]>([])
  const { careers, get: getCareers } = useCareersStore()
  const { cities } = useLocations()
  const { fetchData } = useFunctionaryMethods()

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

      let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      const headerRowIndex = data.findIndex((row: any) =>
        row.includes('Cédula'),
      )
      if (headerRowIndex > -1) {
        const headers = data[headerRowIndex]
        data = data.slice(headerRowIndex + 1)
        data.unshift(headers)
      }

      const filteredData = data

      const sheet = XLSX.utils.json_to_sheet(filteredData, { skipHeader: true })
      const jsonData = XLSX.utils.sheet_to_json(sheet)

      const transformData = (data: any[], careers: any[], cities: any[]) => {
        console.log(data, careers, cities)

        return []
      }

      const transformedData = transformData(jsonData, careers, cities)

      if (
        transformedData == null ||
        transformedData.length < jsonData.length - 1
      ) {
        enqueueSnackbar(
          'Existen errores en la información del formato de estudiantes',
          {
            variant: 'error',
          },
        )

        return
      }

      setStudents(transformedData)
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Error al procesar el archivo', { variant: 'error' })
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
    if (careers?.length === 0) {
      getCareers()
    }
  }, [careers])

  useEffect(() => {
    if (students.length === 0) {
      return
    }

    const fetchBulk = async () => {
      const studentsBulk = await bulkCreate(students)
      if (studentsBulk.length === 0) {
        return
      }

      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }

    fetchBulk()
  }, [students])

  useEffect(() => {
    if (!open) {
      setFiles([])
    }
  }, [open])

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        {title}
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Upload
          multiple
          files={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        />

        <br />

        <label>Formato del archivo: </label>

        <Select
          defaultValue={FILE_FORMATS_TO_UPLOAD[0].value}
          onChange={handleFormatChange}
        >
          {FILE_FORMATS_TO_UPLOAD.map((format) => (
            <MenuItem key={format.value} value={format.value}>
              {format.label}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>

      <DialogActions>
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
      </DialogActions>
    </Dialog>
  )
}
