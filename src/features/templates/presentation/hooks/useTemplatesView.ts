import { useEffect, useState } from 'react'

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
  const { fetchData } = useTemplatesMethods()

  const currentProcess = processes?.find(
    (process) => process.id! === +processId,
  )

  const [templates, setTemplates] = useState<ITemplate[]>([])

  useEffect(() => {
    if (!templates.length) {
      fetchData(processId).then((data) => {
        if (data.count) {
          setTemplates(data.templates)
        }
      })
    }
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
