import React, { createContext, useContext, useEffect } from 'react'

const LocationContext = createContext({})

export const useLocations = () => useContext(LocationContext)

const hardcodedProvinces = [
  { id: 1, name: 'Provincia 1' },
  { id: 2, name: 'Provincia 2' },
]

const hardcodedCities = [
  { id: 1, name: 'Ciudad A', province_id: 1 },
  { id: 2, name: 'Ciudad B', province_id: 1 },
]

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    // TODO: Load provinces and cities from API
    console.log('Provinces and cities fetched')
  }, [])

  return (
    <LocationContext.Provider
      value={{ provinces: hardcodedProvinces, cities: hardcodedCities }}
    >
      {children}
    </LocationContext.Provider>
  )
}
