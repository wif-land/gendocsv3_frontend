import { useEffect, useState } from 'react'

import useLoaderStore from '../../../../shared/store/useLoaderStore'

import { TableProps } from '../../../../shared/sdk/table/types'
import { useTemplatesMethods } from './useTemplatesMethods'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { TemplateModel } from '../../data/models/TemplatesModel'
import { ITemplate } from '../../domain/entities/ITemplate'

interface Props {
  table: TableProps
  field: string
  processId: number
}

export const useTemplateView = ({ table, processId }: Props) => {
  const [tableData, setTableData] = useState<TemplateModel[]>([])
  const [count, setCount] = useState(0)
  const [templates, setTemplates] = useState<TemplateModel[]>([])
  const { loader } = useLoaderStore()
  const { fetchData, updateRow, fetchDataByField } = useTemplatesMethods()

  useEffect(() => {
    let isMounted = true
    if (tableData.length !== 0) return

    if (isMounted) {
      fetchData(processId).then((data) => {
        if (data.count === 0) return
        setTemplates(data.templates)
        setTableData(data.templates)
        setCount(data.count)
      })
    }

    return () => {
      isMounted = false
    }
  }, [tableData])

  const handleUpdateRow = (row: ITemplate) => {
    updateRow(row).then((data) => {
      if (data) {
        const updatedTemplates = templates.map((template) =>
          template.id === data.template.id ? data.template : template,
        )
        setTemplates(updatedTemplates)
        setTableData(updatedTemplates)
      }
    })
  }

  const handleSearch = (field: string) => {
    fetchDataByField(field, table.page).then((response) => {
      if (response?.status === HTTP_STATUS_CODES.OK) {
        setTemplates(response.data.templates as TemplateModel[])
        setTableData(response.data.templates as TemplateModel[])
        setCount(response.data.count)
        return
      }

      if (response?.status === HTTP_STATUS_CODES.NOT_FOUND) {
        setTemplates([])
        setTableData([])
        setCount(0)
        return
      }
    })
  }

  return {
    count,
    tableData,
    loader,
    templates,
    setTableData,
    handleUpdateRow,
    // handleUpdateRows,
    handleSearch,
  }
}
