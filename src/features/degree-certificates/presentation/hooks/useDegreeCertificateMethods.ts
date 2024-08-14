import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { IStudent } from '../../../students/domain/entities/IStudent'
import { useStudentStore } from '../../../students/presentation/state/studentStore'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import { IDegreeCertificate } from '../../domain/entities/IDegreeCertificates'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'

export const useDegreeCertificateMethods = () => {
  const { students } = useStudentStore()

  const fetchData = async (
    rowsPerPage: number,
    currentPage: number,
    filters: IDegreeCertificateFilters,
  ) =>
    await DegreeCertificatesUseCasesImpl.getInstance().getAll(
      filters,
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  const toggleIsClosed = async (
    degreeCertificate: Partial<IDegreeCertificate>,
  ) =>
    await DegreeCertificatesUseCasesImpl.getInstance().update({
      id: degreeCertificate.id as number,
      isClosed: !degreeCertificate.isClosed as boolean,
    })

  const resolveStudentById = async (id: number): Promise<IStudent> =>
    students.find((student) => student.id === id) as unknown as IStudent

  const deleteDegreeCertificate = async (id: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().delete(id)

  const generateDocument = async (degreeCertificateId: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().generateDocument(
      degreeCertificateId,
    )

  const generateNumeration = async (careerId: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().generateNumeration(
      careerId,
    )

  const getReports = async (
    isEnd: boolean,
    data: IDegreeCertificateFilters,
  ) => {
    if (isEnd === true) {
      return await DegreeCertificatesUseCasesImpl.getInstance().getReports({
        careerId: data.careerId,
        startDate: data.startDate,
        endDate: data.endDate,
        field: data.field,
        isEnd: data.isEnd,
        order: data.order,
      })
    } else {
      return await DegreeCertificatesUseCasesImpl.getInstance().getReports({
        careerId: data.careerId,
        field: data.field,
        order: data.order,
      })
    }
  }

  const downloadReport = async (
    isEnd: boolean,
    data: IDegreeCertificateFilters,
  ) => {
    if (isEnd === true) {
      return await DegreeCertificatesUseCasesImpl.getInstance().downloadReport({
        careerId: data.careerId,
        startDate: data.startDate,
        endDate: data.endDate,
        field: data.field,
        isEnd: data.isEnd,
      })
    } else {
      return await DegreeCertificatesUseCasesImpl.getInstance().downloadReport({
        careerId: data.careerId,
        field: data.field,
        order: data.order,
      })
    }
  }

  return {
    fetchData,
    toggleIsClosed,
    resolveStudentById,
    generateDocument,
    generateNumeration,
    deleteDegreeCertificate,
    getReports,
    downloadReport,
  }
}
