import { useCallback, useEffect, useState } from 'react'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { LOADER_DELAY } from '../../../../shared/constants/common'
import { useCareersStore } from '../state/careerStore'
import { CareerModel } from '../../data/models/CareerModel'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'

export const useCareerView = () => {
  const { careers, setCareers } = useCareersStore()
  const { addLoaderItem, removeLoaderItem, loader } = useLoaderStore()
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

      addLoaderItem('council')
      const result = await CareersUseCasesImpl.getInstance().getAll()

      if (result.careers) {
        setCareers(result.careers)
      }

      setTimeout(() => {
        removeLoaderItem('council')
      }, LOADER_DELAY)
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
