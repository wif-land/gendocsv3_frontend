import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { DegreeCertificateModel } from '../../data/models/DegreeCertificateModel'
import { IStudent } from '../../../../features/students/domain/entities/IStudent'
import { IDegreeModality } from '../../../../core/providers/domain/entities/ICertificateProvider'
import { DegreeCertificatesUseCasesImpl } from '../../domain/usecases/DegreeCertificatesUseCases'
import {
  ICreateDegreeCertificate,
  IUpdateDegreeCertificate,
} from '../../domain/entities/IDegreeCertificates'
import { DegreeCertificateForBulk } from '../components/DegreeCertificateBulkUploadDialog'

interface StoreState {
  degreeCertificate: DegreeCertificateModel
  degreeCertificates: DegreeCertificateModel[]
  setDegreeCertificates: (degreeCertificates: DegreeCertificateModel[]) => void
  addDegreeCertificate: (degreeCertificate: DegreeCertificateModel) => void
  createDegreeCertificate: (
    degreeCertificate: ICreateDegreeCertificate,
  ) => Promise<boolean>
  updateDegreeCertificate: (
    degreeCertificate: IUpdateDegreeCertificate,
  ) => Promise<boolean>
  checkPresentationDate: (
    presentationDate?: Date,
    duration?: number,
    roomId?: number,
  ) => Promise<void>
  bulkLoad: (
    data: DegreeCertificateForBulk[],
    userId: number,
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
      checkPresentationDate: async (presentationDate, duration, roomId) => {
        await DegreeCertificatesUseCasesImpl.getInstance().checkPresentationDate(
          {
            presentationDate,
            duration,
            roomId,
          },
        )
      },
      bulkLoad: async (data, userId) => {
        const result =
          await DegreeCertificatesUseCasesImpl.getInstance().bulkLoad({
            data,
            userId,
          })
        return result
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
