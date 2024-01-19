import { useCallback, useEffect, useState } from 'react'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { useDocumentStore } from '../store/documentsStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'
import { LOADER_DELAY } from '../../../../shared/constants/common'
import useModulesStore from '../../../../shared/store/modulesStore'

export const useDocumentView = (moduleName: string) => {
  const { documents, setDocuments } = useDocumentStore()
  const { modules } = useModulesStore()
  const { addLoaderItem, removeLoaderItem, loader } = useLoaderStore()

  const moduleIdentifier =
    modules?.find((module) => module.code === moduleName.toUpperCase())?.id ?? 0

  const [selectedCareer, setSelectedCareer] = useState<DocumentModel | null>(
    null,
  )

  const handleSelectedCouncil = useCallback(
    (item: DocumentModel | null) => {
      setSelectedCareer(item)
    },
    [documents],
  )

  useEffect(() => {
    let isMounted = true

    const fetchingCouncils = async () => {
      if (!isMounted) return

      addLoaderItem('council')
      const result =
        await DocumentsUseCasesImpl.getInstance().getAllProcessesByModuleId(
          moduleIdentifier,
        )

      if (result.processes) {
        setDocuments(result.processes)
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
    documents,
    selectedCareer,
    moduleIdentifier,
    handleSelectedCouncil,
  }
}
