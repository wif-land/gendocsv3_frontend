'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { CertificateTypeModel } from './data/models/certificateTypeModel'
import { CertificateStatusModel } from './data/models/certificateStatusModel'
import { DegreeModalityModel } from './data/models/degreeModalityModel'
import { RoomModel } from './data/models/roomModel'
import { ProvidersUseCasesImpl } from './domain/usecases/ProvidersService'
import { DegCerTemplateUseCasesImpl } from '../../features/degcer-templates/domain/usecases/DegCerTemplatesUseCases'
import { degreeTemplatesStore } from '../../features/degcer-templates/presentation/store/degCerTemplatesStore'

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
  const [certificateTypes, setCertificateTypes] = useState<
    CertificateTypeModel[]
  >([])
  const [certificateStatuses, setCertificateStatuses] = useState<
    CertificateStatusModel[]
  >([])
  const [degreeModalities, setDegreeModalities] = useState<
    DegreeModalityModel[]
  >([])
  const [rooms, setRooms] = useState<RoomModel[]>([])
  const {degCerTemplates, setDegCerTemplates} = degreeTemplatesStore()


  useEffect(() => {
    if (
      certificateTypes.length > 0 &&
      certificateStatuses.length > 0 &&
      degreeModalities.length > 0 &&
      rooms.length > 0 
    )
      return

    ProvidersUseCasesImpl.getInstance()
      .getAllCertificateTypes()
      .then((data) => {
        setCertificateTypes(data)
      })

    ProvidersUseCasesImpl.getInstance()
      .getAllCertificateStatus()
      .then((data) => {
        setCertificateStatuses(data)
      })

    ProvidersUseCasesImpl.getInstance()
      .getAllDegreeModalities()
      .then((data) => {
        setDegreeModalities(data)
      })

    ProvidersUseCasesImpl.getInstance()
      .getAllRooms()
      .then((data) => {
        setRooms(data)
      })

  }, [])

  useEffect(() => {
    let isMounted = true
    if (isMounted && degCerTemplates.length === 0) {
      DegCerTemplateUseCasesImpl.getInstance()
        .getAll()
        .then((data) => {
          setDegCerTemplates(data)
        })
    }
    return () => {
      isMounted = false
    }
  }, [degCerTemplates])

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
