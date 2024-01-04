import React, { use, useEffect, useState } from 'react'
import { StudentsApi } from '@/features/students/api/students'
import { useStudent } from '../../students/hooks/useStudent'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  useDisclosure,
} from '@nextui-org/react'
import { IStudent } from '@/features/students/types/IStudent'
import { ICareer } from '@/features/careers/types/ICareer'
import { useRouter } from 'next/navigation'
import { CareersApi } from '@/features/careers/api/carers'
import AddStudentForm from '@/features/students/components/AddStudentForm'

const StudentsView = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const router = useRouter()
  const rows = [
    {
      key: '1',
      name: 'Tony Reichert',
      role: 'CEO',
      status: 'Active',
    },
    {
      key: '2',
      name: 'Zoey Lang',
      role: 'Technical Lead',
      status: 'Paused',
    },
    {
      key: '3',
      name: 'Jane Fisher',
      role: 'Senior Developer',
      status: 'Active',
    },
    {
      key: '4',
      name: 'William Howard',
      role: 'Community Manager',
      status: 'Vacation',
    },
  ]

  const COLUMNS = [
    {
      key: 'dni',
      label: 'DNI',
    },
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'googleEmail',
      label: 'Correo Personal',
    },
    {
      key: 'outlookEmail',
      label: 'Correo Institucional',
    },
    {
      key: 'approvedCredits',
      label: 'Creditos Aprobados',
    },
    {
      key: 'registration',
      label: 'Matricula',
    },
    {
      key: 'canton',
      label: 'Ciudad de Residencia',
    },
    {
      key: 'gender',
      label: 'Genero',
    },
    {
      key: 'actions',
      label: 'Acciones',
    },
  ]

  const [students, setStudents] = useState<IStudent[]>([])

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await StudentsApi.fetchStudents()
      if (students.students) {
        setStudents(
          students.students.map((student) => ({
            ...student,
            name: `${student.firstName} ${student.secondName} ${student.firstLastName} ${student.secondLastName}`,
          })),
        )
      }
    }
    fetchStudents()
  }, [])

  return (
    <div className="m-10">
      <Button
        className="w-40 h-12 ml-6 border-2  bg-blue-700   text-white"
        onPress={onOpen}
      >
        Crear Estudiante
      </Button>

      <Table aria-label="Example table with dynamic content" className="m-10">
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={students}>
          {(item) => (
            <TableRow key={item.dni}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Estudiante
              </ModalHeader>
              <ModalBody>
                <AddStudentForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default StudentsView
