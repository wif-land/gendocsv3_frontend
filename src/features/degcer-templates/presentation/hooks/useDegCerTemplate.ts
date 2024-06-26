import { degreeTemplatesStore } from '../store/degCerTemplatesStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useEffect, useState } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useDegreeCertificateMethods } from './useDegCerTemplatesMethods'

import { DegCerTemplateModel } from '../../data/models/DegCerTemplateModel'

interface Props {
  table: TableProps
}

export const useDegCerTemplatesView = ({ table }: Props) => {
  const [tableData, setTableData] = useState<DegCerTemplateModel[]>([])
  const { degCerTemplates, setDegCerTemplates } = degreeTemplatesStore()

  const { loader } = useLoaderStore()
  const { fetchData } = useDegreeCertificateMethods()

  useEffect(() => {
    let isMounted = true
    if (tableData.length !== 0 || degCerTemplates.length > 0) {
      setTableData(degCerTemplates)
      return
    }

    if (isMounted) {
      fetchData().then((data) => {
        setTableData(data)
        setDegCerTemplates(data)
        table.setRowsPerPage(data.length)
      })
    }

    return () => {
      isMounted = false
    }
  }, [])

  return {
    tableData,
    loader,
    degCerTemplates,
    setTableData,
  }
}
