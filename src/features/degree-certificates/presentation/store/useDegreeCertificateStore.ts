import { create } from 'zustand'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'

interface StoreState {
  degreeCertificate: DegreeCertificateModel
  getDegreeCertificate: (id: number) => Promise<void>
  getDegreeCertificateAttendees: (id: number) => Promise<void>
}

const DEFAULT_DEGREE_CERTIFICATE: DegreeCertificateModel =
  DegreeCertificateModel.fromJson({})

export const useDegreeCertificateStore = create<StoreState>((set, get) => ({
  degreeCertificate: DEFAULT_DEGREE_CERTIFICATE,
  getDegreeCertificate: async (id) => {
    await DegreeCertificatesUseCasesImpl.getInstance()
      .getById(id)
      .then((data) => {
        set({ degreeCertificate: data })
      })
  },
  getDegreeCertificateAttendees: async (id) => {
    await DegreeCertificatesUseCasesImpl.getInstance()
      .getAttendees(id)
      .then((data) => {
        set({
          degreeCertificate: DegreeCertificateModel.fromJson({
            ...get().degreeCertificate,
            members: data,
          }),
        })
      })
  },
}))
