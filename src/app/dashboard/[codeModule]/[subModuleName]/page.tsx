'use client'
import { useParams } from 'next/navigation'
import UsersView from '../../../../features/modules/components/users-view'
import React, { useEffect } from 'react'

const Page = () => {
  const { codeModule, subModuleName } = useParams()

  const route = `${codeModule}/${subModuleName}`

  useEffect(() => {
    console.log('Page')
  }, [])

  return <div>{route === 'ADMIN/Usuarios' && <UsersView />}</div>
}

export default Page
