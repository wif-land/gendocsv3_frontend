import React, { Key, useEffect, useState } from 'react'
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
  Chip,
  ChipProps,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { MdMoreVert } from 'react-icons/md'
import { toast } from 'react-toastify'
import { IFunctionary } from '../../functionaries/types/IFunctionary'
import { FunctionaryServices } from '../../functionaries/services/functionaryServices'
import { FunctionariesApi } from '../../functionaries/api/functionaries'
import AddFunctionaryForm from '../../functionaries/components/addFunctionaryForm'
import UpdateFunctionaryForm from '../../functionaries/components/updateFunctionaryForm'

interface FunctionariesViewProps extends IFunctionary {
  name: string
}

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
    key: 'googleEmail',
    label: 'Google email',
  },
  {
    key: 'outlookEmail',
    label: 'Outlook email',
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

const FunctionaryView = () => {
  const [functionaries, setFunctionaries] = useState<FunctionariesViewProps[]>(
    [],
  )
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure()
  const [selectedFunctionary, setSelectedFunctionary] = useState<IFunctionary>()

  const onOpenEditChange = (dni: string) => {
    setSelectedFunctionary(
      functionaries.find((functionary) => functionary.dni === dni),
    )
    onOpenChangeEdit()
  }

  const resolveRowComponentByColumnKey = (
    item: FunctionariesViewProps,
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
                  onClick={() => onOpenEditChange(item.dni)}
                >
                  Editar
                </DropdownItem>
                {/* <DropdownItem
                  key="delete"
                  color="danger"
                  onClick={() => onOpenDeleteChange(item.id)}
                >
                  Eliminar
                </DropdownItem> */}
                <DropdownItem
                  key={item.isActive ? 'desactivate' : 'activate'}
                  className={item.isActive ? 'text-danger' : 'text-success'}
                  color={item.isActive ? 'danger' : 'success'}
                  onClick={async () => {
                    await FunctionaryServices.updateFunctionary(item.id!, {
                      isActive: !item.isActive,
                    })
                      .then((_) =>
                        setFunctionaries(
                          functionaries.map((functionary) => {
                            if (functionary.dni === item.dni) {
                              return {
                                ...functionary,
                                isActive: !functionary.isActive,
                              }
                            }

                            return functionary
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
    const getFunctionaries = async () => {
      const functionaries = await FunctionariesApi.fetchFunctionaries()
      if (functionaries.functionaries) {
        setFunctionaries(
          functionaries.functionaries.map((functionary) => ({
            ...functionary,
            name: `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName}`,
          })),
        )
      }
    }
    getFunctionaries()
  }, [])

  return (
    <div>
      <Button
        onClick={() => {
          onOpen()
        }}
      >
        Crear funcionario
      </Button>
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={COLUMNS} className="">
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={functionaries}>
          {(item) => (
            <TableRow key={item.dni}>
              {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create User
              </ModalHeader>
              <ModalBody>
                <AddFunctionaryForm />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit User
              </ModalHeader>
              <ModalBody>
                <UpdateFunctionaryForm
                  functionary={selectedFunctionary as IFunctionary}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
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

export default FunctionaryView
