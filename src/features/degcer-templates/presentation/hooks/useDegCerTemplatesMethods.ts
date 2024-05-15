import { DegCerTemplateUseCasesImpl } from '../../domain/usecases/DegCerTemplatesUseCases'

export const useDegreeCertificateMethods = () => {
  const fetchData = async () =>
    await DegCerTemplateUseCasesImpl.getInstance().getAll()

  return {
    fetchData,
  }
}
