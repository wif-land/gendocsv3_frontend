"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProvidersUseCasesImpl } from './domain/usecases/ProvidersService'
import { IVariableList } from './domain/entities/IVariableProvider'

interface VariableContextData {
  variables: IVariableList;
}

const VariableContext = createContext<VariableContextData>({
  variables: {} as IVariableList,
});


export const useVariables = () => useContext(VariableContext)

export const VariableProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const [variables, setVariables] = useState<IVariableList>({} as IVariableList)

  useEffect(() => {
    ProvidersUseCasesImpl.getInstance().getVariables().then((data) => {
      setVariables(data)
    })
    
  }, [])

  return (
    <VariableContext.Provider
      value={{variables}}
    >
      {children}
    </VariableContext.Provider>
  )
}