import { fetchUsers } from '../../../features/users/api/users'
import { IUser } from '../../../features/auth/types/IUser'
import { Button } from '@nextui-org/react'
import React from 'react'

const UsersView = () => {
  const [users, setUsers] = React.useState<IUser[]>([])

  React.useEffect(() => {
    const fetchingUsers = async () => {
      const users = await fetchUsers()

      if (users.users) setUsers(users.users)
    }
    fetchingUsers()
  }, [])
  return (
    <div>
      <Button>Create User</Button>
      <ul>
        {users.map((user) => (
          <li key={user.sub}>{user.fir}</li>
        ))}
    </div>
  )
}

export default UsersView
