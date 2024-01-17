import React, { Key, useEffect, useState } from 'react'
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
  ScrollShadow
} from '@nextui-org/react'
import { IStudent } from '../../../features/students/types/IStudent'
import AddStudentForm from '../../../features/students/components/AddStudentForm'
import { MdMoreVert } from 'react-icons/md'
import { StudentServices } from '../../students/services/studentServices'
import { toast } from 'react-toastify'
import { useStudentStore } from '../../../shared/store/studentStore'
import UpdateStudentForm from '../../../features/students/components/UpdateStudentForm'
import AddMultipleStudents from '../../../features/students/components/AddMultipleStudents'

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
    key: 'personalEmail',
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
  const [students, setStudents] = useState<StudentsViewProps[]>([])
  const [selectedStudent, setSelectedStudent] = useState<
    StudentsViewProps | undefined
  >(undefined)

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure()
  const { isOpen: isOpenAddMultiple, onOpenChange: onOpenChangeAddMultiple } =
    useDisclosure()
  const {
    students: StudentsStore,
    setStudents: setStudentStore,
    get,
  } = useStudentStore()

  const onOpenEditChange = (id: string) => {
    setSelectedStudent(students.find((student) => student.id === id))
    onOpenChangeEdit()
  }

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
                <DropdownItem
                  key="edit"
                  onClick={() => onOpenEditChange(item.id)}
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  key={item.isActive ? 'desactivate' : 'activate'}
                  className={item.isActive ? 'text-danger' : 'text-success'}
                  color={item.isActive ? 'danger' : 'success'}
                  onClick={async () => {
                    await StudentServices.updateStudent(item.id, {
                      isActive: !item.isActive,
                    })
                      .then(() =>
                        setStudentStore(
                          students?.map((student) => {
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
                  {item.isActive
                    ? 'Desactivar estudiante'
                    : 'Activar estudiante'}
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
    let isMounted = true

    const handleSetStudents = () => {
      if (StudentsStore && isMounted) {
        setStudents(
          StudentsStore.map((student) => ({
            ...student,
            name: `${student.firstName} ${student.secondName} ${student.firstLastName} ${student.secondLastName}`,
          })),
        )
      } else {
        get()
      }
    }

    handleSetStudents()

    return () => {
      isMounted = false
    }
  }, [StudentsStore, setStudentStore])

  return (
    <div className="m-10">
      <Button
        className="w-40 h-12 ml-6 border-2  bg-blue-700   text-white"
        onPress={onOpen}
      >
        Crear Estudiante
      </Button>
      <Button
        className="min-w-40 h-12 ml-6 border-2  bg-blue-700   text-white"
        onPress={onOpenChangeAddMultiple}
      >
        Agregar varios estudiantes
      </Button>

      <Table aria-label="Example table with dynamic content" className="m-10">
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={students} emptyContent={'No existen datos sobre estudiantes'}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" placement='top-center' >
      <ScrollShadow >
        <ModalContent >
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
        </ScrollShadow>
      </Modal>
      <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar estudiante
              </ModalHeader>
              <ModalBody>
                <UpdateStudentForm
                  student={selectedStudent as IStudent}
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenAddMultiple}
        onOpenChange={onOpenChangeAddMultiple}
        size="4xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar varios estudiantes
              </ModalHeader>
              <ModalBody>
                <AddMultipleStudents onClose={onClose} />
              </ModalBody>
              <ModalFooter>
                <Button
                  size="lg"
                  color='danger'
                  className='w-32'
                  radius="sm"
                  onPress={onClose}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default StudentsView
