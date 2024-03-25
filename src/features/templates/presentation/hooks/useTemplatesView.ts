import { useEffect, useState } from 'react'

import useLoaderStore from '../../../../shared/store/useLoaderStore'

import { useTemplatesMethods } from './useTemplatesMethods'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { ITemplate } from '../../domain/entities/ITemplate'

interface Props {
  processId: number
  isDataFiltered: boolean
}

export const useTemplateView = ({ processId, isDataFiltered }: Props) => {
  const [count, setCount] = useState(0)
  const [templates, setTemplates] = useState<TemplateModel[]>([])
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, fetchDataByField } = useTemplatesMethods()

  useEffect(() => {
    let isMounted = true
    if (templates.length !== 0) return

    if (isMounted && !isDataFiltered) {
      fetchData(processId).then((data) => {
        if (data.count === 0) return
        setTemplates(data.templates)
        setCount(data.count)
      })
    }

    return () => {
      isMounted = false
    }
  }, [templates])

  const handleUpdateRow = (row: ITemplate) => {
    updateRow(row).then((data) => {
      if (data) {
        const updatedTemplates = templates.map((template) =>
          template.id === data.template.id ? data.template : template,
        )
        setTemplates(updatedTemplates)
      }
    })
  }

  const handleSearch = (field: string) => {
    fetchDataByField(field, processId).then((response) => {
      console.log(response)

      if (response?.status === HTTP_STATUS_CODES.OK) {
        setTemplates(response.data.templates as TemplateModel[])
        setCount(response.data.count)
        return
      }

      if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
        setTemplates([])
        setCount(0)
        return
      }
    })
  }

  return {
    count,
    loader,
    templates,
    setTemplates,
    handleUpdateRow,
    // handleUpdateRows,
    handleSearch,
  }
}
