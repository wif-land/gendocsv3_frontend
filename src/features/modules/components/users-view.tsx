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
import UpdateUserForm from '../../users/components/updateUserForm'
import AddUserForm from '../../../features/users/components/AddUserForm'
import { useUsersStore } from '../../../shared/store/usersStore'

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
  const [selectedUser, setSelectedUser] = useState<UsersViewProps | undefined>(
    undefined,
  )
  const { load } = useUsersStore()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { isOpen: isOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure()
  const { isOpen: isOpenDelete, onOpenChange: onOpenChangeDelete } =
    useDisclosure()

  const onOpenEditChange = (id: number) => {
    setSelectedUser(users.find((user) => user.id === id))
    onOpenChangeEdit()
  }

  const { setUsers: setUserStore, users: UsersStore } = useUsersStore()

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
                <DropdownItem
                  key="edit"
                  onClick={() => onOpenEditChange(item.id)}
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
                    await UserServices.updateUser(item.id, {
                      isActive: !item.isActive,
                    })
                      .then((_) => {
                        load()
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
                        )
                      })
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
    let isMounted = true

    const handleSetStudents = () => {
      if (UsersStore && isMounted) {
        setUsers(
          UsersStore.map((user) => ({
            ...user,
            name: `${user.firstName} ${user.secondName} ${user.firstLastName} ${user.secondLastName}`,
          })),
        )
      } else {
        const fetchingUsers = async () => {
          const result = await UsersApi.get()

          if (result.users && isMounted) {
            setUserStore(result.users)
          }
        }

        fetchingUsers()
      }
    }

    handleSetStudents()

    return () => {
      isMounted = false
    }
  }, [UsersStore, setUserStore])

  return (
    <div className="m-10">
      <Button
        onPress={onOpen}
        radius="sm"
        className="w-40 h-12 ml-6 border-2  bg-blue-700   text-white"
      >
        Create User
      </Button>
      <div className="m-6">
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={COLUMNS} className="">
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create User
              </ModalHeader>
              <ModalBody>
                <AddUserForm onClose={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEdit} onOpenChange={onOpenChangeEdit} size='3xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit User
              </ModalHeader>
              <ModalBody>
                <UpdateUserForm
                  user={selectedUser as IUser}
                  onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete User
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estas seguro que deseas eliminar este usuario?{' '}
                  {selectedUser?.firstName} {selectedUser?.firstLastName}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={async () => {
                    await UsersApi.deleteUser(selectedUser?.id as number)
                      .then((_) => {
                        setUsers(
                          users.filter((user) => user.id !== selectedUser?.id),
                        )
                        onClose()
                      })
                      .catch((error) => {
                        toast.error(error.message)
                      })
                  }}
                >
                  Delete
                </Button>
                <Button color="success" variant="light" onPress={onClose}>
                  Cancel
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
