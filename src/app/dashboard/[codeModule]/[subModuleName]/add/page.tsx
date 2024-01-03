'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import AddUserForm from '../../../../../features/users/components/AddUserForm'

const AddPage = () => {
  const { codeModule } = useParams()
  console.log(codeModule)

  switch (codeModule) {
    case 'ADMIN':
      return <AddUserForm />
    default:
      return <div>DEFAULT</div>
  }
}

export default AddPage
