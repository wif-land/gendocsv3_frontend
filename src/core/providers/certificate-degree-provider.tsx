import React, { createContext, useContext, useEffect, useState } from 'react'
import { CertificateTypeModel } from './data/models/certificateTypeModel'
import { CertificateStatusModel } from './data/models/certificateStatusModel'
import { DegreeModalityModel } from './data/models/degreeModalityModel'
import { RoomModel } from './data/models/roomModel'
import { ProvidersUseCasesImpl } from './domain/usecases/ProvidersService'

export interface CertificateContextData {
  certificateTypes: CertificateTypeModel[]
  certificateStatuses: CertificateStatusModel[]
  degreeModalities: DegreeModalityModel[]
  rooms: RoomModel[]
}

const CertificateContext = createContext<CertificateContextData>({
  certificateTypes: [],
  certificateStatuses: [],
  degreeModalities: [],
  rooms: [],
})

export const useCertificateData = () => useContext(CertificateContext)

export const CertificateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const [certificateTypes, setCertificateTypes] = useState<CertificateTypeModel[]>([])
  const [certificateStatuses, setCertificateStatuses] = useState<CertificateStatusModel[]>([])
  const [degreeModalities, setDegreeModalities] = useState<DegreeModalityModel[]>([])
  const [rooms, setRooms] = useState<RoomModel[]>([])

  useEffect(() => {
    if (certificateTypes.length > 0 && certificateStatuses.length > 0 && degreeModalities.length > 0 && rooms.length > 0) return

    ProvidersUseCasesImpl.getInstance().getAllCertificateTypes().then((data) => {
      setCertificateTypes(data.certificateTypes)
    })

    ProvidersUseCasesImpl.getInstance().getAllCertificateStatus().then((data) => {
      setCertificateStatuses(data.certificateStatus)
    })

    ProvidersUseCasesImpl.getInstance().getAllDegreeModalities().then((data) => {
      setDegreeModalities(data.degreeModalities)
    })

    ProvidersUseCasesImpl.getInstance().getAllRooms().then((data) => {
      setRooms(data.rooms)
    })

    console.log('CertificateProvider')

  }, [])

  return (
    <CertificateContext.Provider
      value={{
        certificateTypes,
        certificateStatuses,
        degreeModalities,
        rooms,
      }}
    >
      {children}
    </CertificateContext.Provider>
  )
}
