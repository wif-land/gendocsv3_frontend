import { useCallback, useState } from 'react'
import { CouncilModel } from '../../data/models/CouncilModel'
import { useCouncilStore } from '../store/councilsStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import useModulesStore from '../../../../shared/store/modulesStore'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { LOADER_DELAY } from '../../../../shared/constants/common'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'

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

  // useEffect(() => {
  //   let isMounted = true

  //   const fetchingCouncils = async () => {
  //     if (!isMounted) return

  //     addLoaderItem('council')
  //     const result =
  //       await CouncilsUseCasesImpl.getInstance().getAllCouncilsByModuleId(
  //         moduleIdentifier,
  //         // eslint-disable-next-line no-magic-numbers
  //         5,
  //         0,
  //       )

  //     if (result.councils) {
  //       setCouncils(result.councils)
  //     }

  //     setTimeout(() => {
  //       removeLoaderItem('council')
  //     }, LOADER_DELAY)
  //   }

  //   fetchingCouncils()

  //   return () => {
  //     isMounted = false
  //   }
  // }, [])

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    addLoaderItem('council')

    try {
      const response =
        await CouncilsUseCasesImpl.getInstance().getAllCouncilsByModuleId(
          moduleIdentifier,
          rowsPerPage,
          currentPage * rowsPerPage,
        )

      if (response.status === HTTP_STATUS_CODES.OK && response.data) {
        if ('councils' in response.data && 'count' in response.data) {
          return response.data as { councils: CouncilModel[]; count: number }
        }
      }
    } catch (error) {
      return {
        councils: [] as CouncilModel[],
        count: -1,
      }
    } finally {
      setTimeout(() => {
        removeLoaderItem('council')
      }, LOADER_DELAY)
    }
  }

  const updateRow = async (council: Partial<CouncilModel>) => {
    addLoaderItem('council')

    try {
      const response = await CouncilsUseCasesImpl.getInstance().update(
        council.id as number,
        {
          isActive: !council.isActive,
        },
      )

      if (response.status === HTTP_STATUS_CODES.OK && response.council) {
        return response.council
      }
    } catch (error) {
      return {} as CouncilModel
    } finally {
      setTimeout(() => {
        removeLoaderItem('council')
      }, LOADER_DELAY)
    }
  }

  return {
    loader,
    councils,
    selectedCareer,
    moduleIdentifier,
    handleSelectedCouncil,
    setCouncils,
    fetchData,
    updateRow,
  }
}
