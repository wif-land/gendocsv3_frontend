import { UsersApi } from '../../../features/users/api/users'
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
  Input,
  Chip,
  ChipProps,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { Key, useEffect, useState } from 'react'
import { MdMoreVert } from 'react-icons/md'
import { UserServices } from '../../users/services/userServices'
import { toast } from 'react-toastify'
import { IUser } from '../../auth/types/IUser'
import { useRouter } from 'next/navigation'

interface UsersViewProps extends IUser {
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

const UsersView = () => {
  const [users, setUsers] = useState<UsersViewProps[]>([])
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const router = useRouter()

  const resolveRowComponentByColumnKey = (
    item: {
      id: number
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
                <DropdownItem key="edit">Editar</DropdownItem>
                <DropdownItem
                  key={item.isActive ? 'desactivate' : 'activate'}
                  className={item.isActive ? 'text-danger' : 'text-success'}
                  color={item.isActive ? 'danger' : 'success'}
                  onClick={async () => {
                    await UserServices.updateUser(item.id, {
                      isActive: !item.isActive,
                    })
                      .then((_) =>
                        setUsers(
                          users.map((user) => {
                            if (user.id === item.id) {
                              return {
                                ...user,
                                isActive: !user.isActive,
                              }
                            }

                            return user
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
    const fetchingUsers = async () => {
      const users = await UsersApi.fetchUsers()

      if (users.users) {
        setUsers(
          users.users.map((user) => ({
            ...user,
            name: `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`,
          })),
        )
      }
    }

    fetchingUsers()
  }, [])

  return (
    <div className='m-10'>
      <Button onPress={() => router.push('Usuarios/add')} radius="sm" className='w-40 h-12 ml-6 border-2 border-blue-900 bg-white   text-blue-900'>Create User</Button>
      <div className="m-6">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={COLUMNS} className='bg-red-800'>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => resolveRowComponentByColumnKey(item, columnKey)}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create User
              </ModalHeader>
              <ModalBody>
                <form action="">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="firstName"
                    label="Nombre"
                    variant="underlined"
                    placeholder="Ingrese el nombre"
                    className="w-full"
                  />
                  <Input
                    id="secondName"
                    name="secondName"
                    type="secondName"
                    label="Segundo Nombre"
                    variant="underlined"
                    placeholder="Ingrese el segundo nombre"
                    className="w-full"
                  />
                  <Input
                    id="firstLastName"
                    name="firstLastName"
                    type="firstLastName"
                    label="Apellido"
                    variant="underlined"
                    placeholder="Ingrese el primer apellido"
                    className="w-full"
                  />
                  <Input
                    id="secondLastName"
                    name="secondLastName"
                    type="secondLastName"
                    label="Segundo Apellido"
                    variant="underlined"
                    placeholder="Ingrese el segundo apellido"
                    className="w-full"
                  />
                  <Input
                    id="googleEmail"
                    name="googleEmail"
                    type="googleEmail"
                    label="Google Email"
                    variant="underlined"
                    placeholder="Ingrese el correo de google"
                    className="w-full"
                  />
                  <Input
                    id="outlookEmail"
                    name="outlookEmail"
                    type="outlookEmail"
                    label="Outlook Email"
                    variant="underlined"
                    placeholder="Ingrese el correo de outlook"
                    className="w-full"
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default UsersView
