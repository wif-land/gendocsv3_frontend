import { useEffect, useState, useCallback } from 'react'

import * as XLSX from 'xlsx'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Dialog, { DialogProps } from '@mui/material/Dialog'

import { Upload } from '../../../../shared/sdk/upload'
import Iconify from '../../../../core/iconify'
import { enqueueSnackbar } from 'notistack'
import { useStudentStore } from '../state/studentStore'
import { useCareersStore } from '../../../careers/presentation/state/careerStore'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { IStudent } from '../../domain/entities/IStudent'

interface Props extends DialogProps {
  title?: string
  onCreate?: VoidFunction
  onUpdate?: VoidFunction
  folderName?: string
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void
  open: boolean
  onClose: VoidFunction
}

export const StudentBulkUploadDialog = ({
  title = 'Sube un excel con los datos de los estudiantes',
  open,
  onClose,
  ...other
}: Props) => {
  const [files, setFiles] = useState<(File | string)[]>([])
  const [students, setStudents] = useState<IStudent[]>([])
  const { get: getStudents } = useStudentStore()
  const { careers } = useCareersStore()

  let isValid = true

  const transformData = (data: any) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.map((item: any) => {
      if (
        !item['Primer Nombre'] ||
        !item['Fecha de nacimiento'] ||
        !item['Carrera'] ||
        !item['Cédula'] ||
        !item['Género'] ||
        !item['Número celular'] ||
        !item['Cantón'] ||
        !item['Créditos Aprovados'] ||
        !item['Folio'] ||
        !item['registration'] ||
        !item['outlookEmail'] ||
        !item['personalEmail'] ||
        !item['Primer Apellido'] ||
        !item['Segundo Apellido'] ||
        !item['Segundo Nombre'] ||
        !item['Teléfono convencional']
      ) {
        isValid = false
        enqueueSnackbar(
          'Por favor, asegúrate de que todos los campos estén completos',
          { variant: 'error' },
        )
        return
      }
      const excelDate = new Date(
        // eslint-disable-next-line no-magic-numbers
        Math.round((item['Fecha de nacimiento'] - 25569) * 86400 * 1000),
      )
      const formattedDate = excelDate.toISOString().split('T')[0]

      return {
        firstName: item['Primer Nombre'],
        secondName: item['Segundo Nombre'],
        firstLastName: item['Primer Apellido'],
        secondLastName: item['Segundo Apellido'],
        outlookEmail: item['outlookEmail'],
        personalEmail: item['personalEmail'],
        phoneNumber: item['Número celular'],
        regularPhoneNumber: item['Teléfono convencional'],
        dni: item['Cédula'].toString(),
        registration: item['registration'].toString(),
        folio: item['Folio'].toString(),
        gender: item['Género'],
        birthdate: formattedDate,
        canton: item['Cantón'],
        approvedCredits: parseInt(item['Créditos Aprovados'], 10),
        isActive: true,
        career: careers?.find(
          (career: ICareer) => career.name === item['Carrera'],
        )?.id,
      }
    })

  useEffect(() => {
    if (!open) {
      setFiles([])
    }
  }, [open])

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

  const handleUpload = async () => {
    onClose()
    console.log({ files })
    console.info('ON UPLOAD')
    const reader = new FileReader()
    reader.onload = (evt) => {
      if (evt.target === null) {
        return
      }
      const bstr = evt.target.result as string
      const workbook = XLSX.read(bstr, { type: 'binary' })
      const worksheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[worksheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)
      const transformedData = transformData(data)
      console.log(JSON.stringify(transformedData, null, 2))
      setStudents(transformedData)
    }

    reader.readAsBinaryString(files[0] as File)

    // let newStudents: boolean = false

    // if (!isValid) {
    //   setStudents([])
    // } else {
    //   try {
    //     if (!students) {
    //       return
    //     }

    //     const { status, studentsAdded } =
    //       await StudentUseCasesImpl.getInstance().bulkCreate(students)
    //     if (status !== HTTP_STATUS_CODES.CREATED) {
    //       enqueueSnackbar('Error al crear los estudiantes!', {
    //         variant: 'error',
    //       })
    //     } else {
    //       getStudents()
    //       newStudents = studentsAdded as boolean
    //     }
    //   } catch (error) {
    //     enqueueSnackbar('Error al crear los estudiantes!', { variant: 'error' })
    //   }
    // }

    // if (newStudents) {
    //   enqueueSnackbar('Proceso completado')
    // }

    onClose()
  }

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile)
    setFiles(filtered)
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

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
