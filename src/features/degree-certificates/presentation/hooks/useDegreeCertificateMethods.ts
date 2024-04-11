import { DegreeCertificateModel } from '../../data/models/CertificateDegreeModel'

export const useDegreeCertificateMethods = () => {
  const handleCreateDegreeCertificate = async (
    data: DegreeCertificateModel,
  ) => {
    console.log(data)
  }

  const handleUpdateDegreeCertificate = async (
    id: number,
    editedFields: Partial<DegreeCertificateModel>,
  ) => {
    console.log(id, editedFields)
  }

  return {
    handleCreateDegreeCertificate,
    handleUpdateDegreeCertificate,
  }
}
