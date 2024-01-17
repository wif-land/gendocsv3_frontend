'use client'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const { driveId } = useParams()
  const documentURL = `https://docs.google.com/document/d/${driveId}/edit?usp=sharing`

  return (
    <div>
      <iframe src={documentURL} width="100%" height="850px" />
    </div>
  )
}

export default Page
