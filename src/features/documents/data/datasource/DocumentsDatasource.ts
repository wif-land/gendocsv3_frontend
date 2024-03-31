import { DocumentModel } from '../models/DocumentsModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IDocument } from '../../domain/entities/IDocument'
import { NumerationModel } from '../models/NumerationModel'
import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { DefaultResponse } from '../../../../core/utils/default-response'

export interface DocumentsDataSource {
  getAll(): Promise<{
    status: number
    documents: DocumentModel[]
  }>

  getAllDocumentsByModuleId(
    moduleId: number,
    paginationParams: PaginationParams,
  ): Promise<DefaultResponse<DocumentModel[]>>

  create(process: IDocument): Promise<DefaultResponse<DocumentModel>>

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
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.GET_ALL, {
      params: { moduleId, ...paginationParams },
    })

    if ('error' in result) {
      return { success: false }
    }

    const { data } = result

    return {
      success: true,
      data: data.content as {
        documents: DocumentModel[]
        count: number
      },
    }
  }

  create = async (document: DocumentModel) => {
    const result = await AxiosClient.post(API_ROUTES.DOCUMENTS.CREATE, document)

    if ('error' in result) {
      return { success: false }
    }

    const { data } = result

    return { success: true, document: data.content as DocumentModel }
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.GET_ALL)

    if ('error' in result) {
      return { status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, documents: [] }
    }

    const { status, data } = result

    return { status, documents: data.content as DocumentModel[] }
  }

  deleteById = async (id: number) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.DOCUMENTS.DELETE.replace(':id', id.toString()),
    })

    if ('error' in result) {
      return { status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR }
    }

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

    if ('error' in result) {
      return { data: {} as NumerationModel }
    }

    const { data } = result

    return {
      data: data.content as NumerationModel,
    }
  }
}
