import { useEffect, useState } from 'react'

import { useDegCerGradesStore } from '../store/degCerGradesStore'
import { DegCerGradesModel } from '../../data/models/DegCerGradesModel'
import { useDegreeCertificateMethods } from './useDegCerTemplatesMethods'

interface Props {
  certificateStatusId: number
}

export const useDegCerGrades = ({ certificateStatusId }: Props) => {
  const [tableData, setTableData] = useState<DegCerGradesModel[]>([])

  const { fetchCellGrades, deleteCellGrade, createCellGrade } =
    useDegreeCertificateMethods()

  const { degCerGrades, setDegCerGrades } = useDegCerGradesStore()
  const [shouldRefetch, setShouldRefetch] = useState(false)

  useEffect(() => {
    let isMounted = true

    if (!shouldRefetch && tableData.length > 0) return

    if (isMounted && certificateStatusId) {
      fetchCellGrades(certificateStatusId).then((data) => {
        setDegCerGrades(data)
        setTableData(data)
        setShouldRefetch(false)
      })
    }

    return () => {
      isMounted = false
    }
  }, [certificateStatusId, shouldRefetch])

  const handleDelete = (id: number) => {
    deleteCellGrade(id).then((isDeleted) => {
      if (isDeleted) {
        const filteredData = tableData.filter((item) => item.id !== id)
        setTableData(filteredData)
        setDegCerGrades(filteredData)
        setShouldRefetch(true)
      }
    })
  }

  const handleCreate = async (data: DegCerGradesModel) => {
    const response = await createCellGrade(certificateStatusId, data)
    if (response) {
      setTableData([...tableData, response])
      setDegCerGrades([...tableData, response])
      setShouldRefetch(true)
    }
  }

  return {
    tableData,
    setTableData,
    degCerGrades,
    handleDelete,
    handleCreate,
  }
}
