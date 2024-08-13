"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { DegreeModel } from "./data/models/degreeModel"
import { ProvidersUseCasesImpl } from "./domain/usecases/ProvidersService"
import { useAccountStore } from "../../features/auth/presentation/state/useAccountStore"

export interface DegreeContextData {
    degrees: DegreeModel[]
}

const CertificateContext = createContext<DegreeContextData>({
    degrees: []
})

export const useDegreeData = () => useContext(CertificateContext)

export const DegreeProvider = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    const [degrees, setDegrees] = useState<DegreeModel[]>([])
    const isLogged = useAccountStore((state) => state.isLogged)

  
    useEffect(() => {
      if (!isLogged) return
      if (degrees.length > 0) return
  
      ProvidersUseCasesImpl.getInstance().getAllDegrees().then((data) => {
        setDegrees(data)
      })
  
    }, [isLogged])
  
    return (
      <CertificateContext.Provider
        value={{
            degrees,
        }}
      >
        {children}
      </CertificateContext.Provider>
    )
  }

