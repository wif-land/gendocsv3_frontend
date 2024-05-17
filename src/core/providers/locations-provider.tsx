"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProvidersUseCasesImpl } from './domain/usecases/ProvidersService'
import { CityModel } from './data/models/cityModel'
import { ProvinceModel } from './data/models/provinceModel'

interface LocationContextData {
  provinces: ProvinceModel[];
  cities: CityModel[];
}

const LocationContext = createContext<LocationContextData>({
  provinces: [],
  cities: [],
});


export const useLocations = () => useContext(LocationContext)

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {

  const [provinces, setProvinces] = useState<ProvinceModel[]>([])
  const [cities, setCities] = useState<CityModel[]>([])

  useEffect(() => {
    if (provinces.length > 0 && cities.length > 0) return
    ProvidersUseCasesImpl.getInstance().getAllCities().then((data) => {      
      setCities(data)
    })
    ProvidersUseCasesImpl.getInstance().getAllProvinces().then((data) => {
      setProvinces(data)
    })
  }, [])

  return (
    <LocationContext.Provider
      value={{ provinces, cities }}
    >
      {children}
    </LocationContext.Provider>
  )
}