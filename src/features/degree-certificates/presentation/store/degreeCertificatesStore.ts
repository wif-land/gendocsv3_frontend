import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DegreeCertificateModel } from '../../data/DegreeCertificateModel'

interface StoreState {
  degreeCertificate: DegreeCertificateModel
  degreeCertificates: DegreeCertificateModel[]
  setDegreeCertificates: (degreeCertificates: DegreeCertificateModel[]) => void
  addDegreeCertificate: (degreeCertificate: DegreeCertificateModel) => void
}

const STORE_NAME = 'degree-certificates-store'
const DEFAULT_DEGREE_CERTIFICATE: DegreeCertificateModel = {
  date: new Date(),
  id: 0,
  isActive: true,
  name: '',
}
const DEFAULT_DEGREE_CERTIFICATES: DegreeCertificateModel[] = []

export const useDegreeCertificatesStore = create<StoreState>(
  persist(
    (set) => ({
      degreeCertificate: DEFAULT_DEGREE_CERTIFICATE,
      degreeCertificates: DEFAULT_DEGREE_CERTIFICATES,
      setDegreeCertificates: (data) => set({ degreeCertificates: data }),
      addDegreeCertificate: (data) =>
        set((state) => ({
          degreeCertificates: [...state.degreeCertificates, data],
        })),
    }),
    {
      name: STORE_NAME,
      onRehydrateStorage: (state) => {
        if (!state.degreeCertificate) {
          state.degreeCertificate = DEFAULT_DEGREE_CERTIFICATE
        }
      },
    },
  ) as StateCreator<StoreState>,
)
