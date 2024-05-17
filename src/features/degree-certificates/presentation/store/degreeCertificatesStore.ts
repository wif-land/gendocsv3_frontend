import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IStudent } from '../../../../features/students/domain/entities/IStudent'
import { IDegreeModality } from '../../../../core/providers/domain/entities/ICertificateProvider'

interface StoreState {
  degreeCertificate: DegreeCertificateModel
  degreeCertificates: DegreeCertificateModel[]
  setDegreeCertificates: (degreeCertificates: DegreeCertificateModel[]) => void
  addDegreeCertificate: (degreeCertificate: DegreeCertificateModel) => void
}

const STORE_NAME = 'degree-certificates-store'
const DEFAULT_DEGREE_CERTIFICATE: DegreeCertificateModel = {
  number: 0,
  auxNumber: 0,
  topic: '',
  presentationDate: new Date(),
  student: {} as IStudent,
  career: 0,
  certificateType: 0,
  certificateStatus: 0,
  degreeModality: {} as IDegreeModality,
  room: 0,
  duration: 0,
  link: '',
  gradesSheetDriveId: '',
  documentDriveId: '',
  isClosed: false,
} as DegreeCertificateModel

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
