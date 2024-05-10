import { DegreeCertificateModel } from '../../data/models/model'
import { useDegreeCertificatesStore } from '../store/degreeCertificatesStore'
import { getAllItems } from '../../../../core/layout/_common/searchbar/utils'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'

export const useDegreeCertificateMethods = () => {
  const { degreeCertificates, setDegreeCertificates } =
    useDegreeCertificatesStore()
  const { loader } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().getAll()

  const updateRow = async (degreeCertificate: Partial<IDegreeCertificate>) =>
    await DegreeCertificatesUseCasesImpl.getInstance().update(
      degreeCertificate.id as number,
      { isActive: !degreeCertificate.isActive },
    )
}
