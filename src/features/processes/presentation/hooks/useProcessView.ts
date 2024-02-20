import { useCallback, useEffect, useState } from 'react'

import useLoaderStore from '../../../../shared/store/useLoaderStore'
import useModulesStore from '../../../../shared/store/modulesStore'

import { ProcessModel } from '../../data/models/ProcessesModel'
import { ProcessesUseCasesImpl } from '../../domain/usecases/ProcessServices'

import { useProcessStore } from '../state/useProcessStore'

export const useProcessView = ({ moduleId }: { moduleId: string }) => {
  const { processes, setProcesses } = useProcessStore()
  const { loader } = useLoaderStore()
  const [selectedCareer, setSelectedCareer] = useState<ProcessModel | null>(
    null,
  )
  const { modules } = useModulesStore()
  const moduleIdentifier =
    modules?.find((module) => module.code === moduleId.toUpperCase())?.id ?? 0

  const handleSelectedCouncil = useCallback(
    (item: ProcessModel | null) => {
      setSelectedCareer(item)
    },
    [processes],
  )

  useEffect(() => {
    let isMounted = true

    const fetchingProcesses = async () => {
      if (!isMounted) return
      const result =
        await ProcessesUseCasesImpl.getInstance().getAllProcessesByModuleId(
          moduleIdentifier,
        )

      if (result.processes) {
        setProcesses(result.processes)
      }
    }

    fetchingProcesses()
    return () => {
      isMounted = false
    }
  }, [])

  return {
    loader,
    processes,
    selectedCareer,
    handleSelectedCouncil,
    setProcesses,
  }
}
