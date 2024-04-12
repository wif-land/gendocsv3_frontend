import React, { createContext, useContext, useEffect } from 'react'

const CertificateContext = createContext({})

export const useCertificateData = () => useContext(CertificateContext)

const hardcodedCertificateTypes = [
  { code: '01', name: 'Tipo 1' },
  { code: '02', name: 'Tipo 2' },
]

const hardcodedCertificateStatuses = [
  { code: 'A', male_name: 'Aprobado', female_name: 'Aprobada' },
  { code: 'R', male_name: 'Reprobado', female_name: 'Reprobada' },
]

const hardcodedDegreeModalities = [
  { code: 'MOD1', name: 'Modalidad 1' },
  { code: 'MOD2', name: 'Modalidad 2' },
]

const hardcodedRooms = [{ name: '101' }, { name: '102' }]

export const CertificateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    // TODO: Load data from API
    console.log('All data fetched')
  }, [])
  return (
    <CertificateContext.Provider
      value={{
        certificateTypes: hardcodedCertificateTypes,
        certificateStatuses: hardcodedCertificateStatuses,
        degreeModalities: hardcodedDegreeModalities,
        rooms: hardcodedRooms,
      }}
    >
      {children}
    </CertificateContext.Provider>
  )
}
