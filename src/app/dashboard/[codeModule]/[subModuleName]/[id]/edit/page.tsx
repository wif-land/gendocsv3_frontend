'use client'
import { useParams } from 'next/navigation'
import React from 'react'
import UpdateUserForm from '../../../../../../features/users/components/UpdateUserForm'

const EditPage = () => {
  const { subModuleName } = useParams()
  console.log(subModuleName)

  switch (subModuleName) {
    case 'Usuarios':
      return <UpdateUserForm />
    // case 'Funcionarios':
    //   return <FunctionaryForm />
    // case 'Estudiantes':
    //   return <AddStudentForm />
    default:
      return <div>DEFAULT</div>
  }
}

export default EditPage
