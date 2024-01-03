'use client'
import { useParams } from 'next/navigation'
import UsersView from '../../../../features/modules/components/users-view'
import { useEffect } from 'react'
import StudentsView from '../../../../features/modules/components/students-view'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  useEffect(() => {
    console.log('Page')
  }, [])

  return <div>
          {route === 'ADMIN/Usuarios' && <UsersView />}
          {route === 'ADMIN/Estudiantes'&&  <StudentsView/>}
        </div>
}

export default Page
