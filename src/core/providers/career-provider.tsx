'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { CareerModel } from '../../features/careers/data/models/CareerModel'
import { CareersDataSourceImpl } from '@/features/careers/data/datasources/CareerDatasource'
import { useAccountStore } from '../../features/auth/presentation/state/useAccountStore'

export interface CareerContextData {
  careers: CareerModel[]
}

const CareerContext = createContext<CareerContextData>({
  careers: [],
})

export const useCareerData = () => useContext(CareerContext)

export const CareerProvider = ({ children }: { children: React.ReactNode }) => {
  const [careers, setCareers] = useState<CareerModel[]>([])
  const isLogged = useAccountStore((state) => state.isLogged)

  useEffect(() => {
    if (!isLogged) return
    if (careers.length > 0) return

    CareersDataSourceImpl.getInstance()
      .getAll()
      .then((data) => {
        setCareers(data)
      })
  }, [careers, isLogged])

  return (
    <CareerContext.Provider value={{ careers }}>
      {children}
    </CareerContext.Provider>
  )
}
