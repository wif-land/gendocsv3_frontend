import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { useEffect, useState } from 'react'
import { TableProps } from '../../../../shared/sdk/table'
import { useDegreeCertificateMethods } from './useDegCerTemplatesMethods'

import { useDegCerGradesStore } from '../store/degCerGradesStore'
import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'

interface Props {
  table: TableProps
  certificateStatusId: number
}

export const useDegCerGrades = ({ certificateStatusId }: Props) => {
  const [tableData, setTableData] = useState<DegCerGradesModel[]>([])

  const { loader } = useLoaderStore()
  const { fetchCellGrades, deleteCellGrade } = useDegreeCertificateMethods()

  const { degCerGrades, setDegCerGrades } = useDegCerGradesStore()

  useEffect(() => {
    let isMounted = true
    // if (tableData.length !== 0) {
    //   setTableData(degCerGrades)
    //   return
    // }

    if (isMounted) {
      fetchCellGrades(certificateStatusId).then((data) => {
        setDegCerGrades(data)
        setTableData(data)
      })
    }

    return () => {
      isMounted = false
    }
  }, [tableData])

  const handleDelete = (id: number) => {
    deleteCellGrade(id).then((isDeleted) => {
      if (isDeleted) {
        const filteredData = tableData.filter((item) => item.id !== id)
        setTableData(filteredData)
        setDegCerGrades(filteredData)
      }
    })
  }

  return {
    tableData,
    loader,
    setTableData,
    degCerGrades,
    handleDelete,
  }
}
