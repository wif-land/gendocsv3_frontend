"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { DegreeModel } from "./data/models/degreeModel"
import { ProvidersUseCasesImpl } from "./domain/usecases/ProvidersService"

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

  
    useEffect(() => {
      if (degrees.length > 0) return
  
      ProvidersUseCasesImpl.getInstance().getAllDegrees().then((data) => {
        setDegrees(data)
      })
  
    }, [])
  
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

