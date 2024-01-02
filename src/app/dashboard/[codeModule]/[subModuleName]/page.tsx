'use client'
import UsersView from '../../../../features/modules/components/users-view'
import React, { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
    console.log('Page')
  }, [])

  return (
    <div>
      <UsersView />
    </div>
  )
}

export default Page
