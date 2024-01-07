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
import { useFunctionaryStore } from '@/shared/store/functionaryStore'
import { set } from 'date-fns'

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
  const [selectedFunctionary, setSelectedFunctionary] = useState<IFunctionary>()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure()

  const {
    functionaries: FunctionariesStore,
    setFunctionaries: setFunctionariesStore,
    get,
  } = useFunctionaryStore()

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
                <DropdownItem
                  key={item.isActive ? 'desactivate' : 'activate'}
                  className={item.isActive ? 'text-danger' : 'text-success'}
                  color={item.isActive ? 'danger' : 'success'}
                  onClick={async () => {
                    await FunctionaryServices.updateFunctionary(item.id!, {
                      isActive: !item.isActive,
                    })
                      .then((_) =>
                        setFunctionariesStore(
                          functionaries?.map((functionary) => {
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
    if (FunctionariesStore) {
      setFunctionaries(
        FunctionariesStore.map((functionary) => ({
          ...functionary,
          name: `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName}`,
        })),
      )
    } else {
      get()
    }
  }, [FunctionariesStore, setFunctionariesStore])

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
                Crear funcionario
              </ModalHeader>
              <ModalBody>
                <AddFunctionaryForm onClose={onClose} />
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
                Editar Funcionario
              </ModalHeader>
              <ModalBody>
                <UpdateFunctionaryForm
                  functionary={selectedFunctionary as IFunctionary}
                  onClose={onClose}
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

export default FunctionaryView
