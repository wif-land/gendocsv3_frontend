import { DocumentModel } from '../models/DocumentsModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IDocument } from '../../domain/entities/IDocument'
import { NumerationModel } from '../models/NumerationModel'

export interface DocumentsDataSource {
  getAll(): Promise<{
    status: number
    documents: DocumentModel[]
  }>

  getAllDocumentsByModuleId(moduleId: number): Promise<{
    status: number
    documents: DocumentModel[]
  }>

  getById(id: number): Promise<{
    status: number
    document: DocumentModel
  }>

  update(process: Partial<IDocument>): Promise<{
    status: number
  }>

  create(process: IDocument): Promise<{
    status: number
    document: DocumentModel
  }>

  deleteById(id: number): Promise<{
    status: number
  }>

  getNumerationByCouncil(councilId: number): Promise<{
    status: number
    document: NumerationModel
  }>
}

export class DocumentsDataSourceImpl implements DocumentsDataSource {
  static instance: DocumentsDataSourceImpl

  static getInstance = (): DocumentsDataSourceImpl => {
    if (!DocumentsDataSourceImpl.instance) {
      DocumentsDataSourceImpl.instance = new DocumentsDataSourceImpl()
    }

    return DocumentsDataSourceImpl.instance
  }

  async getAllDocumentsByModuleId(moduleId: number) {
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.GET_ALL, {
      params: { moduleId },
    })

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, documents: [] as DocumentModel[] }
    }

    return { status, documents: data.content as DocumentModel[] }
  }

  create = async (process: DocumentModel) => {
    const result = await AxiosClient.post(API_ROUTES.DOCUMENTS.CREATE, process)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, document: {} as DocumentModel }
    }

    return { status, document: data.content as DocumentModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.GET_ALL)

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, documents: [] as DocumentModel[] }
    }

    return { status, documents: data.content as DocumentModel[] }
  }

  update = async (process: Partial<IDocument>) => {
    const { id, ...rest } = process

    const result = await AxiosClient.patch(
      API_ROUTES.DOCUMENTS.UPDATE.replace(':id', id?.toString() || ''),
      rest,
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status }
    }

    return { status, document: data.content as DocumentModel }
  }

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  deleteById = async (id: number) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.DOCUMENTS.DELETE.replace(':id', id.toString()),
    })

    const { status } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status }
    }

    return { status }
  }

  getNumerationByCouncil = async (councilId: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.DOCUMENT_NUMERATION.GET_BY_COUNCIL,
      {
        params: { councilId },
      },
    )

    const { status, data } = result

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
      return { status, document: {} as NumerationModel }
    }

    return { status, document: data.content as NumerationModel }
  }
}
