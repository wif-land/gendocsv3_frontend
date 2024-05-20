import { IStudent } from '../../../students/domain/entities/IStudent'
import { useStudentStore } from '../../../students/presentation/state/studentStore'
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

  const generateDocument = async (degreeCertificateId: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().generateDocument(
      degreeCertificateId,
    )

  const generateNumeration = async (carrerId: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().generateNumeration(
      carrerId,
    )

  return {
    fetchData,
    toggleIsClosed,
    resolveStudentById,
    generateDocument,
    generateNumeration,
  }
}
