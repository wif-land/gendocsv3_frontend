import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'

export const useDegreeCertificateMethods = () => {
  const fetchData = async (rowsPerPage: number, currentPage: number) =>
    await DegreeCertificatesUseCasesImpl.getInstance().getAll(
      rowsPerPage,
      currentPage,
    )

  // const updateRow = async (degreeCertificate: Partial<IDegreeCertificate>) =>
  //   await DegreeCertificatesUseCasesImpl.getInstance().update(
  //     degreeCertificate.id as number,
  //     { isActive: !degreeCertificate.isActive },
  //   )

  return {
    fetchData,
    // updateRow,
  }
}
