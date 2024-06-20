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
    carrerId: number,
  ) =>
    await DegreeCertificatesUseCasesImpl.getInstance().getAll(
      rowsPerPage,
      currentPage,
      carrerId,
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

  const generateNumeration = async (carrerId: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().generateNumeration(
      carrerId,
    )

  const getReports = async (
    isEnd: boolean,
    data: IDegreeCertificateFilters,
  ) => {
    if (isEnd === true) {
      return await DegreeCertificatesUseCasesImpl.getInstance().getReports({
        careerId: data.careerId,
        dateType: data.dateType,
        startDate: data.startDate,
        endDate: data.endDate,
        field: data.field,
      })
    } else {
      return await DegreeCertificatesUseCasesImpl.getInstance().getReports({
        careerId: data.careerId,
        field: data.field,
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
        dateType: data.dateType,
        startDate: data.startDate,
        endDate: data.endDate,
        field: data.field,
      })
    } else {
      return await DegreeCertificatesUseCasesImpl.getInstance().downloadReport({
        careerId: data.careerId,
        field: data.field,
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
