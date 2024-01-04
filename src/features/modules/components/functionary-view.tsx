import { IFunctionary } from '@/features/functionaries/types/IFunctionary'
import React, { useEffect, useState } from 'react'
import { FunctionariesApi } from '@/features/functionaries/api/functionaries'
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
import { Key } from '@react-types/shared'
import { MdMoreVert } from 'react-icons/md'
import { FunctionaryServices } from '@/features/functionaries/services/functionaryServices'
import { toast } from 'react-toastify'




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
  const [functionaries, setFunctionaries] = useState<FunctionariesViewProps[]>([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure()
  const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure()
  const [selectedFunctionary, setSelectedFunctionary] = useState<FunctionariesViewProps | undefined>(undefined)

  const onOpenEditChange = (dni: string) => {
    setSelectedFunctionary(functionaries.find((functionary) => functionary.dni=== dni))
    onOpenChangeEdit()
  }

  const onOpenDeleteChange = (dni: string) => {
    setSelectedFunctionary(functionaries.find((functionary) => functionary.dni === dni))
    onOpenChangeDelete()
  }
  

  
  const resolveRowComponentByColumnKey = (
    item: {
      dni: string
      name: string
      googleEmail: string
      outlookEmail: string
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
                    await FunctionaryServices.updateFunctionary(item.dni, {
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
        setFunctionaries(functionaries.functionaries.map((functionary) => ({
          ...functionary,
          name: `${functionary.firstName} ${functionary.secondName} ${functionary.firstLastName} ${functionary.secondLastName}`,
        })))
      }
      
    }
    getFunctionaries()
  }, [])


  return (
    <div>
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
    </div>
  )
}

export default FunctionaryView;
