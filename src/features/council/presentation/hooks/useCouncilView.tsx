import { useCallback, useEffect, useState } from 'react'
import { CouncilModel } from '../../data/models/CouncilModel'
import { useCouncilStore } from '../store/councilsStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import useModulesStore from '../../../../shared/store/modulesStore'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { LOADER_DELAY } from '../../../../shared/constants/common'

export const useCouncilView = ({ moduleId }: { moduleId: string }) => {
  const { modules } = useModulesStore()
  const { councils, setCouncils } = useCouncilStore()
  const { addLoaderItem, removeLoaderItem, loader } = useLoaderStore()

  const moduleIdentifier =
    modules?.find((module) => module.code === moduleId.toUpperCase())?.id ?? 0

  const [selectedCareer, setSelectedCareer] = useState<CouncilModel | null>(
    null,
  )

  const handleSelectedCouncil = useCallback(
    (item: CouncilModel | null) => {
      setSelectedCareer(item)
    },
    [councils],
  )

  useEffect(() => {
    let isMounted = true

    const fetchingCouncils = async () => {
      if (!isMounted) return

      addLoaderItem('council')
      const result =
        await CouncilsUseCasesImpl.getInstance().getAllCouncilsByModuleId(
          moduleIdentifier,
          // eslint-disable-next-line no-magic-numbers
          5,
          0,
        )

      if (result.councils) {
        setCouncils(result.councils)
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
    councils,
    selectedCareer,
    moduleIdentifier,
    handleSelectedCouncil,
    setCouncils,
  }
}
