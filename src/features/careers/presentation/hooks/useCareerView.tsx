import { useCallback, useEffect, useState } from 'react'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useCareersStore } from '../state/careerStore'
import { CareerModel } from '../../data/models/CareerModel'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'

export const useCareerView = () => {
  const { careers, setCareers } = useCareersStore()
  const { loader } = useLoaderStore()
  const [selectedCareer, setSelectedCareer] = useState<CareerModel | null>(null)

  const handleSelectedCouncil = useCallback(
    (item: CareerModel | null) => {
      setSelectedCareer(item)
    },
    [careers],
  )

  useEffect(() => {
    let isMounted = true

    const fetchingCouncils = async () => {
      if (!isMounted) return
      const result = await CareersUseCasesImpl.getInstance().getAll()
      if (!result) return
      setCareers(result.careers)
    }

    fetchingCouncils()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    loader,
    careers,
    selectedCareer,
    handleSelectedCouncil,
    setCareers,
  }
}
