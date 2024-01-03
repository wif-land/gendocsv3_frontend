'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import AddUserForm from '../../../../../features/users/components/AddUserForm'
import FunctionaryForm from '../../../../../features/functionaries/components/addFunctionaryForm'

const AddPage = () => {
  const { subModuleName } = useParams()
  console.log(subModuleName)

  switch (subModuleName) {
    case 'Usuarios':
      return <AddUserForm />
    case 'Funcionarios':
      return <FunctionaryForm />
    default:
      return <div>DEFAULT</div>
  }
}

export default AddPage
