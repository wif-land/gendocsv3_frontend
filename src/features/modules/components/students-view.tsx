import React, { Key, use, useEffect, useState } from 'react'
import { StudentsApi } from '@/features/students/api/students'
import { useStudent } from '../../students/hooks/useStudent'
import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import { MdMoreVert } from 'react-icons/md'
import { StudentServices } from '../../students/services/studentServices'
import { toast } from 'react-toastify'

interface StudentsViewProps extends IStudent {
  name: string
}
const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  paused: 'danger',
}
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
    key: 'isActive',
    label: 'Activo',
  },
  {
    key: 'actions',
    label: 'Acciones',
  },
]

const StudentsView = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const router = useRouter()

  const [students, setStudents] = useState<StudentsViewProps[]>([])

  const resolveRowComponentByColumnKey = (
    item: {
      id: string
      isActive: boolean
    },
    columnKey: Key,
  ) => {
    switch (columnKey) {
      case 'isActive':
        return (
          <TableCell>
            {
              <Chip
                className="capitalize"
                color={statusColorMap[item.isActive ? 'active' : 'paused']}
                size="sm"
                variant="flat"
              >
                {item.isActive ? 'Si' : 'No'}
              </Chip>
            }
          </TableCell>
        )
      case 'actions':
        return (
          <TableCell>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light">
                  <MdMoreVert size={25} />
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem
                  key={item.isActive ? 'desactivate' : 'activate'}
                  className={item.isActive ? 'text-danger' : 'text-success'}
                  color={item.isActive ? 'danger' : 'success'}
                  onClick={async () => {
                    await StudentServices.updateStudent(item.id, {
                      isActive: !item.isActive,
                    })
                      .then(() =>
                        setStudents(
                          students.map((student) => {
                            if (student.id === item.id) {
                              return {
                                ...student,
                                isActive: !student.isActive,
                              }
                            }

                            return student
                          }),
                        ),
                      )
                      .catch((error) => {
                        toast.error(error.message)
                      })
                  }}
                >
                  {item.isActive ? 'Desactivar usuario' : 'Activar usuario'}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TableCell>
        )
      default:
        return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
    }
  }

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
            <TableRow key={item.id}>
              {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
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
