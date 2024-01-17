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
} from '@nextui-org/react'
import { MdMoreVert } from 'react-icons/md'
import { toast } from 'react-toastify'
import { IProcess } from '../../../features/process/types/IProcess'
import { useProcessesStore } from '../../../shared/store/processStore'
import AddProcessForm from '../../../features/process/components/addProcessForm'
import { ProcessApi } from '../../../features/process/api/processes'
import { HTTP_STATUS_CODES } from '../../../shared/utils/app-enums'
import EditProcessForm from '../../../features/process/components/editProcessForm'

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  paused: 'danger',
}
const COLUMNS = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'moduleId',
    label: 'Modulo',
  },
  {
    key: 'userId',
    label: 'Usuario',
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

const StudentsView = ({ moduleId }: { moduleId: string }) => {
  const [selectedProcess, setSelectedProcess] = useState<IProcess | undefined>(
    undefined,
  )

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure()
  const { processes, setProcesses } = useProcessesStore()

  const onOpenEditChange = (id: string) => {
    setSelectedProcess(
      processes?.find((process) => process.id.toString() === id),
    )
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
                    await ProcessApi.updateProcess(+item.id, {
                      isActive: !item.isActive,
                    })
                      .then(() =>
                        setProcesses(
                          processes?.map((process) => {
                            if (process.id.toString() === item.id) {
                              return {
                                ...process,
                                isActive: !process.isActive,
                              }
                            }

                            return process
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
    const handleSetProcesses = async () => {
      if (!processes) {
        const { status, processes } = await ProcessApi.fetchProcessesByModule(
          moduleId.toUpperCase(),
        )
        if (status === HTTP_STATUS_CODES.OK) {
          setProcesses(processes)
        }
        return
      }
    }

    handleSetProcesses()
  }, [processes, setProcesses])

  return (
    <div className="m-10">
      <Button
        className="w-40 h-12 ml-6 border-2  bg-blue-700   text-white"
        onPress={onOpen}
      >
        Crear Proceso
      </Button>

      {processes && processes.length > 0 ? (
        <Table aria-label="Example table with dynamic content" className="m-10">
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={processes}>
            {(item) => (
              <TableRow key={item.id.toString()}>
                {(columnKey) =>
                  resolveRowComponentByColumnKey(
                    { ...item, id: item.id.toString() },
                    columnKey,
                  )
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <p style={{ textAlign: 'center' }}>Sin registros</p>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Proceso
              </ModalHeader>
              <ModalBody>
                <AddProcessForm onClose={onClose} moduleId={moduleId} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Proceso
              </ModalHeader>
              <ModalBody>
                <EditProcessForm
                  onClose={onClose}
                  process={selectedProcess as IProcess}
                  moduleId={moduleId}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
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
