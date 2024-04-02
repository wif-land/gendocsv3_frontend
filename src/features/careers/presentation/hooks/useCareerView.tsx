import { useCallback, useEffect, useState } from 'react'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useCareersStore } from '../state/careerStore'
import { CareerModel } from '../../data/models/CareerModel'
import { useCareerCommands } from './useCareerCommands'
import { ICareer } from '../../domain/entities/ICareer'

export const useCareerView = () => {
  const { careers, setCareers } = useCareersStore()
  const { loader } = useLoaderStore()
  const [selectedCareer, setSelectedCareer] = useState<CareerModel | null>(null)
  const { fetchData, updateRow } = useCareerCommands()

  const handleSelectedCouncil = useCallback(
    (item: CareerModel | null) => {
      setSelectedCareer(item)
    },
    [careers],
  )

  useEffect(() => {
    let isMounted = true

    fetchData().then((data) => {
      if (!isMounted) return
      if (data) setCareers(data as ICareer[])
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleUpdateRow = (row: CareerModel) => {
    updateRow(row).then((data) => {
      if (data) {
        setCareers(
          careers?.map((functionary) =>
            functionary.id === data.id ? data : functionary,
          ),
        )
      }
    })
  }

  return {
    loader,
    careers,
    selectedCareer,
    handleSelectedCouncil,
    handleUpdateRow,
    setCareers,
  }
}
