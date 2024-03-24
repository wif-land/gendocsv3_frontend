import { DocumentModel } from '../models/DocumentsModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IDocument } from '../../domain/entities/IDocument'
import { NumerationModel } from '../models/NumerationModel'
import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { DefaultResponse } from '../../domain/repositories/DocumentsRepository'

export interface DocumentsDataSource {
  getAll(): Promise<{
    status: number
    documents: DocumentModel[]
  }>

  getAllDocumentsByModuleId(
    moduleId: number,
    paginationParams: PaginationParams,
  ): Promise<DefaultResponse<DocumentModel[]>>

  getById(id: number): Promise<{
    status: number
    document: DocumentModel
  }>

  create(process: IDocument): Promise<{
    status: number
    document: DocumentModel
  }>

  deleteById(id: number): Promise<{
    status: number
  }>

  getNumerationByCouncil(councilId: number): Promise<{
    data: NumerationModel
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

  async getAllDocumentsByModuleId(
    moduleId: number,
    paginationParams: PaginationParams,
  ) {
    const result = await AxiosClient.get<{
      count: number
      documents: DocumentModel[]
    }>(API_ROUTES.DOCUMENTS.GET_ALL, {
      params: { moduleId, ...paginationParams },
    })

    const { status, data } = result

    if (status !== HTTP_STATUS_CODES.OK) {
      return { status, data: { count: 0, documents: [] } }
    }

    return { status, data: data.content }
  }

  create = async (document: DocumentModel) => {
    const result = await AxiosClient.post(API_ROUTES.DOCUMENTS.CREATE, document)

    const { status, data } = result

    return { status, document: data.content as DocumentModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.GET_ALL)

    const { status, data } = result

    return { status, documents: data.content as DocumentModel[] }
  }

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  deleteById = async (id: number) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.DOCUMENTS.DELETE.replace(':id', id.toString()),
    })

    const { status } = result

    return { status }
  }

  getNumerationByCouncil = async (councilId: number) => {
    const result = await AxiosClient.get<NumerationModel>(
      API_ROUTES.DOCUMENT_NUMERATION.GET_BY_COUNCIL,
      {
        params: { councilId },
      },
    )

    const { data } = result

    return {
      data: data.content as NumerationModel,
    }
  }
}
