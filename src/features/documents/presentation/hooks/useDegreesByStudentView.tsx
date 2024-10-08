import { useEffect, useState } from 'react'
import { DegreeCertificateModel } from '../../../../features/degree-certificates/data/models/DegreeCertificateModel'
import { DegreeCertificatesUseCasesImpl } from '../../../degree-certificates/domain/usecases/DegreeCertificatesUseCases'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

interface Props {
  studentDni: string
}

export const useDegreesByStudentView = ({ studentDni }: Props) => {
  const [tableData, setTableData] = useState<DegreeCertificateModel[]>([])

  useEffect(() => {
    let isMounted = true

    if (isMounted && studentDni) {
      DegreeCertificatesUseCasesImpl.getInstance()
        .getByFilters({ field: studentDni }, new PaginationDTO(1, 100))
        .then((data) => {
          setTableData(data.degreeCertificates)
        })
    }

    return () => {
      isMounted = false
    }
  }, [studentDni])

  return {
    tableData,
  }
}
