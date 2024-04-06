import { useEffect } from 'react'

import useLoaderStore from '../../../../shared/store/useLoaderStore'

import { useTemplatesMethods } from './useTemplatesMethods'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { ITemplate } from '../../domain/entities/ITemplate'
import { useProcessStore } from '../../../../features/processes/presentation/state/useProcessStore'

interface Props {
  processId: number
  isDataFiltered: boolean
}

export const useTemplateView = ({ processId }: Props) => {
  const { loader } = useLoaderStore()
  const { updateRow } = useTemplatesMethods()
  const { processes, updateTemplate } = useProcessStore()

  const currentProcess = processes?.find(
    (process) => process.id! === +processId,
  )

  let templates = currentProcess?.templateProcesses

  useEffect(() => {
    if (templates?.length !== 0) return
    templates = currentProcess?.templateProcesses
  }, [templates, processes, currentProcess, processId])

  const handleUpdateRow = (row: ITemplate) => {
    updateRow(row).then((data) => {
      if (data) {
        updateTemplate(
          processId,
          data.template.id as number,
          data.template as TemplateModel,
        )
      }
    })
  }

  return {
    loader,
    templates,
    updateTemplate,
    handleUpdateRow,
  }
}
