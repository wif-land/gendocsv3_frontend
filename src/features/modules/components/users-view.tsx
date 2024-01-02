import { fetchUsers } from '../../../features/users/api/users'
import { IResponseUser } from '../../../features/auth/types/IUser'
import { Button } from '@nextui-org/react'
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

  useEffect(() => {
    console.log({ usersLocal: users })
  }, [users])
  return (
    <div>
      <Button>Create User</Button>
      {users.map((user) => (
        <div className="bg-red" key={user.id}>
          <ul>
            <li key={user.id}>{user.firstName}</li>
          </ul>
        </div>
      ))}
    </div>
  )
}

export default UsersView
