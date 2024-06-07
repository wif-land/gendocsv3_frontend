import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IStudent } from '../../../../features/students/domain/entities/IStudent'
import { IDegreeModality } from '../../../../core/providers/domain/entities/ICertificateProvider'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import { ICreateDegreeCertificate } from '../../domain/entities/IDegreeCertificates'

interface StoreState {
  degreeCertificate: DegreeCertificateModel
  degreeCertificates: DegreeCertificateModel[]
  setDegreeCertificates: (degreeCertificates: DegreeCertificateModel[]) => void
  addDegreeCertificate: (degreeCertificate: DegreeCertificateModel) => void
  createDegreeCertificate: (
    degreeCertificate: ICreateDegreeCertificate,
  ) => Promise<boolean>
  updateDegreeCertificate: (
    degreeCertificate: Partial<DegreeCertificateModel>,
  ) => Promise<boolean>
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
  certificateDriveId: '',
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
      createDegreeCertificate: async (degreeCertificate) => {
        const result =
          await DegreeCertificatesUseCasesImpl.getInstance().create(
            degreeCertificate,
          )

        if (result.id !== 0) {
          set((state) => ({
            degreeCertificates: [...state.degreeCertificates, result],
          }))

          return true
        }

        return false
      },
      updateDegreeCertificate: async (degreeCertificate) => {
        const result =
          await DegreeCertificatesUseCasesImpl.getInstance().update(
            degreeCertificate,
          )

        if (result.id !== 0) {
          set((state) => ({
            degreeCertificates: state.degreeCertificates.map((item) =>
              item.id === result.id ? result : item,
            ),
          }))

          return true
        }

        return false
      },
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
