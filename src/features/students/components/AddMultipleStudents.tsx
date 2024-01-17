import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { useCareersStore } from '../../../shared/store/careerStore'
import { StudentsApi } from '../api/students'
import { IStudent } from '../types/IStudent'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import { toast } from 'react-toastify'
import { useStudentStore } from '../../../shared/store/studentStore'
import { Button } from '@nextui-org/react'

const AddMultipleStudents = ({ onClose }: { onClose: () => void }) => {
  const [students, setStudents] = useState<IStudent[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { careers } = useCareersStore()
  const { get: getStudents } = useStudentStore()
  let isValid = true

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        toast.error(
          'Por favor, asegúrate de que todos los campos estén completos',
          { autoClose: 1800 },
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
        careerId: careers?.find((career) => career.name === item['Carrera'])
          ?.id,
      }
    })
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return
    }

    const file = e.target.files[0]
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
      setStudents(transformedData)
    }
    reader.readAsBinaryString(file)
  }

  const handleReset = () => {
    setStudents([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    let newStudents: boolean = false

    if (!isValid) {
      setStudents([])
    } else {
      try {
        if (!students) {
          return
        }

        const { status, studentsAdded } =
          await StudentsApi.createManyStudents(students)
        if (status === HTTP_STATUS_CODES.CREATED) {
          getStudents()
          newStudents = studentsAdded as boolean
        } else {
          toast.error('Error al crear los estudiantes!', { autoClose: 1800 })
        }
      } catch (error) {
        toast.error('Error al crear los estudiantes!', { autoClose: 1800 })
      }
    }

    if (newStudents) {
      toast.success('Proceso completado', { autoClose: 1800 })
    }

    onClose()
  }

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="m-2 bg-white"
      />
      <br />
      <Button
        onClick={handleReset}
        className="m-2 w-40 bg-red-700 text-white"
        radius="sm"
      >
        Eliminar archivo
      </Button>
      <br />
      <a href="/FormatoEstudiantes.xlsx" download="FormatoEstudiantes.xlsx">
        <Button className="m-2 w-40 bg-green-700 text-white" radius="sm">
          Descargar formato
        </Button>
      </a>
      <br />
      <Button
        onClick={handleSave}
        className="m-2 w-40 bg-blue-600 text-white"
        radius="sm"
      >
        Cargar {isValid ? students.length : ''} registros
      </Button>
    </div>
  )
}

export default AddMultipleStudents
