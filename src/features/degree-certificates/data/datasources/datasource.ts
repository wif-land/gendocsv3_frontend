import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { IDegreeCertificateFilters } from '../../domain/entities/IDegreeCertificateFilters'
import {
  ICreateDegreeCertificate,
  IDegreeCertificate,
} from '../../domain/entities/IDegreeCertificates'
import { DegreeCertificateModel } from '../models/DegreeCertificateModel'
import { DegreeCertificateForBulk } from '../../presentation/components/DegreeCertificateBulkUploadDialog'
import { IDegreeCertificateAttendance } from '../../domain/entities/IDegreeCertificateAttendee'

export interface IDegreeCertificateDatasource {
  getAll(
    limit: number,
    offset: number,
    carrerId: number,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  getByFilters(
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  update(
    degreeCertificate: Partial<IDegreeCertificate>,
  ): Promise<DegreeCertificateModel>

  create(
    degreeCertificate: ICreateDegreeCertificate,
  ): Promise<DegreeCertificateModel>

  generateNumeration(careerId: number): Promise<{
    firstGenerated: number
    lastGenerated: number
  }>

  getLastNumberToRegister(careerId: number): Promise<number>

  generateDocument(degreeCertificateId: number): Promise<DegreeCertificateModel>

  checkPresentationDate({
    presentationDate,
    duration,
    roomId,
  }: {
    presentationDate?: Date
    duration?: number
    roomId?: number
  }): Promise<void>

  getById(id: number): Promise<DegreeCertificateModel>

  setAttendance(id: number): Promise<void>

  bulkLoad({
    data,
    userId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
  }): Promise<boolean>

  getReports(
    carrerId: number,
    isEnd: string,
  ): Promise<{
    count: number
    degreeCertificates: DegreeCertificateModel[]
  }>

  downloadReport(id: number): Promise<{
    fileName: string
    file: string
  }>

  createAttendance(data: IDegreeCertificateAttendance): Promise<void>
}

export class DegreeCertificateDatasourceImpl
  implements IDegreeCertificateDatasource
{
  static instance: DegreeCertificateDatasourceImpl

  static getInstance = (): DegreeCertificateDatasourceImpl => {
    if (!DegreeCertificateDatasourceImpl.instance) {
      DegreeCertificateDatasourceImpl.instance =
        new DegreeCertificateDatasourceImpl()
    }

    return DegreeCertificateDatasourceImpl.instance
  }

  createAttendance = async (data: IDegreeCertificateAttendance) => {
    const result = await AxiosClient.post(
      API_ROUTES.DEGREE_CERTIFICATES.CREATE_ATTENDANCE,
      data,
    )

    if ('error' in result) {
      return Promise.reject()
    }

    return Promise.resolve()
  }

  getById = async (id: number) => {
    const result = await AxiosClient.get(API_ROUTES.DEGREE_CERTIFICATES.GET(id))

    if ('error' in result) {
      return {} as DegreeCertificateModel
    }

    return result.data as DegreeCertificateModel
  }

  getAll = async (limit: number, offset: number, carrerId: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.GET_ALL(carrerId),
      {
        params: { limit, offset },
      },
    )

    if ('error' in result) {
      return {
        count: 0,
        degreeCertificates: [] as DegreeCertificateModel[],
      }
    }

    return result.data as {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }

  getByFilters = async (
    filters: IDegreeCertificateFilters,
    limit: number,
    offset: number,
  ) => {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.GET_ALL(filters.career),
      {
        params: { ...filters, limit, offset },
      },
    )

    if ('error' in result) {
      return { count: 0, degreeCertificates: [] as DegreeCertificateModel[] }
    }

    return result.data as {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }

  update = async (degreeCertificate: IDegreeCertificate) => {
    const { id, ...rest } = degreeCertificate
    const result = await AxiosClient.patch(
      API_ROUTES.DEGREE_CERTIFICATES.UPDATE(id as number),
      rest,
    )

    if ('error' in result) {
      return {} as DegreeCertificateModel
    }

    return result.data as DegreeCertificateModel
  }

  create = async (degreeCertificate: ICreateDegreeCertificate) => {
    const result = await AxiosClient.post(
      API_ROUTES.DEGREE_CERTIFICATES.CREATE,
      degreeCertificate,
    )

    if ('error' in result) {
      return {} as DegreeCertificateModel
    }

    return result.data as DegreeCertificateModel
  }

  generateNumeration = async (careerId: number) => {
    const result = await AxiosClient.patch(
      API_ROUTES.DEGREE_CERTIFICATES.GENERATE_NUMERATION(careerId),
    )

    if ('error' in result) {
      return { firstGenerated: 0, lastGenerated: 0 }
    }

    return result.data as { firstGenerated: number; lastGenerated: number }
  }

  getLastNumberToRegister = async (careerId: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.GET_LAST_NUMBER_TO_REGISTER(careerId),
    )

    if ('error' in result) {
      return 0
    }

    return result.data as number
  }

  generateDocument = async (degreeCertificateId: number) => {
    const result = await AxiosClient.patch(
      API_ROUTES.DEGREE_CERTIFICATES.GENERATE_DOCUMENT(degreeCertificateId),
    )

    if ('error' in result) {
      return {} as DegreeCertificateModel
    }

    return result.data as DegreeCertificateModel
  }

  async checkPresentationDate({
    presentationDate,
    duration,
    roomId,
  }: {
    presentationDate?: Date
    duration?: number
    roomId?: number
  }): Promise<void> {
    await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.CHECK_PRESENTATION_DATE,
      {
        data: {
          presentationDate,
          duration,
          roomId,
        },
      },
    )
  }

  setAttendance = async (id: number) => {
    await AxiosClient.patch(API_ROUTES.DEGREE_CERTIFICATES.SET_ATTENDANCE(id))
  }

  async bulkLoad({
    data,
    userId,
  }: {
    data: DegreeCertificateForBulk[]
    userId: number
  }): Promise<boolean> {
    const result = await AxiosClient.patch(
      API_ROUTES.DEGREE_CERTIFICATES.BULK_LOAD(userId),
      data,
    )

    if ('error' in result) {
      return false
    }

    return result.data as boolean
  }

  async getReports(carrerId: number, isEnd: string) {
    const result = await AxiosClient.get(
      API_ROUTES.DEGREE_CERTIFICATES.REPORTS(carrerId, isEnd),
    )

    if ('error' in result) {
      return {
        count: 0,
        degreeCertificates: [] as DegreeCertificateModel[],
      }
    }

    return result.data as {
      count: number
      degreeCertificates: DegreeCertificateModel[]
    }
  }

  downloadReport = async (id: number) => {
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.DOWNLOAD(id))

    if ('error' in result) {
      return { fileName: '', file: '' }
    }

    return result.data as { fileName: string; file: string }
  }
}
