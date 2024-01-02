'use client'
import React, { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
    console.log('Page')
  }, [])

  return <div>Page</div>
}

export default Page
