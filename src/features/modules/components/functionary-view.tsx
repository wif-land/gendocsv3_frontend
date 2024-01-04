import { IFunctionary } from '@/features/functionaries/types/IFunctionary'
import React, { useEffect, useState } from 'react'

export const functionaryView = () => {
  const [functionaries, setFunctionaries] = useState<IFunctionary[]>([])

  useEffect(() => {
    const getFunctionaries = async () => {
      // const functionaries = await FunctionaryServices.getFunctionaries()
      // setFunctionaries(functionaries)
    }
    getFunctionaries()
  }, [])
  return (
    <>
      <div>functionary-view</div>
    </>
  )
}
