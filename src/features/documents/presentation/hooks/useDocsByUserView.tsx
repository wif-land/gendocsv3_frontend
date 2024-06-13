import { useEffect, useState } from 'react'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { DocumentsUseCasesImpl } from '../../domain/usecases/DocumentServices'

interface Props {
  studentId: number
}

export const useDocsByStudentView = ({ studentId }: Props) => {
  const [tableData, setTableData] = useState<DocumentModel[]>([])

  useEffect(() => {
    let isMounted = true

    if (isMounted && studentId) {
      DocumentsUseCasesImpl.getInstance()
        .getAllByStudentId(studentId)
        .then((data) => {
          setTableData(data.documents as DocumentModel[])
        })
    }

    return () => {
      isMounted = false
    }
  }, [studentId])

  return {
    tableData,
  }
}
