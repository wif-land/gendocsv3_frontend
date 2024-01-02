import { fetchUsers } from '../../../features/users/api/users'
import { IResponseUser } from '../../../features/auth/types/IUser'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue, useDisclosure, Input } from '@nextui-org/react'
import React, { useEffect } from 'react'

const UsersView = () => {
  const [users, setUsers] = React.useState<IResponseUser[]>([])

  React.useEffect(() => {
    const fetchingUsers = async () => {
      const users = await fetchUsers()

      console.log({ users })

      if (users.users) setUsers(users.users)
    }
    fetchingUsers()
  }, [])

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const columns = [
    {
      key: "firstName",
      label: "Nombre",
    },
    {
      key: "secondName",
      label: "Segundo Nombre",
    },
    {
      key: "firstLastName",
      label: "Apellido",
    },
    {
      key: "secondLastName",
      label: "Segundo Apellido",
    },
    {
      key: "googleEmail",
      label: "Google email",
    },
    {
      key: "outlookEmail",
      label: "Outlook email",
    },
    
  ];
  

  useEffect(() => {
    console.log({ usersLocal: users })
  }, [users])
  return (
    <div>
      <Button onPress={onOpen}>Create User</Button>
      <div className='m-6'>
        <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create User</ModalHeader>
              <ModalBody>
                <form action="">
                  <Input 
                    id='firstName'
                    name='firstName'
                    type='firstName'
                    label='Nombre'
                    variant='underlined'
                    placeholder='Ingrese el nombre'
                    className='w-full'/>
                  <Input
                    id='secondName'
                    name='secondName'
                    type='secondName'
                    label='Segundo Nombre'
                    variant='underlined'
                    placeholder='Ingrese el segundo nombre'
                    className='w-full'/>
                  <Input
                    id='firstLastName'
                    name='firstLastName'
                    type='firstLastName'
                    label='Apellido'
                    variant='underlined'
                    placeholder='Ingrese el primer apellido'
                    className='w-full'/>
                  <Input
                    id='secondLastName'
                    name='secondLastName'
                    type='secondLastName'
                    label='Segundo Apellido'
                    variant='underlined'
                    placeholder='Ingrese el segundo apellido'
                    className='w-full'/>
                  <Input
                    id='googleEmail'
                    name='googleEmail'
                    type='googleEmail'
                    label='Google Email'
                    variant='underlined'
                    placeholder='Ingrese el correo de google'
                    className='w-full'/>
                  <Input
                    id='outlookEmail'
                    name='outlookEmail'
                    type='outlookEmail'
                    label='Outlook Email'
                    variant='underlined'
                    placeholder='Ingrese el correo de outlook'
                    className='w-full'/>

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
      {/* {users.map((user) => (
        <div className="bg-red" key={user.id}>
          <ul>
            <li key={user.id}>{user.}</li>
          </ul>
        </div>
      ))} */}
    </div>
  )
}

export default UsersView
