'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import AddUserForm from '../../../../../features/users/components/AddUserForm'
import FunctionaryForm from '../../../../../features/functionaries/components/addFunctionaryForm'
import AddStudentForm from '../../../../../features/students/components/AddStudentForm'

const AddPage = () => {
  const { subModuleName } = useParams()

  switch (subModuleName) {
    case 'Usuarios':
      return <AddUserForm />
    case 'Funcionarios':
      return <FunctionaryForm />
    case 'Estudiantes':
      return <AddStudentForm />
    default:
      return <div>DEFAULT</div>
  }
}

export default AddPage
