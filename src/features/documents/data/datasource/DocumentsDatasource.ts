import { DocumentModel } from '../models/DocumentsModel'
import { AxiosClient } from '../../../../shared/utils/AxiosClient'
import { API_ROUTES } from '../../../../shared/constants/appApiRoutes'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IDocument } from '../../domain/entities/IDocument'
import { NumerationModel } from '../models/NumerationModel'
import { PaginationParams } from '../../../../shared/utils/PaginationUtil'

export interface DocumentsDataSource {
  getAll(): Promise<{
    documents: DocumentModel[]
  }>

  getAllDocumentsByModuleId(
    moduleId: number,
    paginationParams: PaginationParams,
  ): Promise<{
    documents: DocumentModel[]
    count: number
  }>

  create(process: IDocument): Promise<DocumentModel>

  deleteById(id: number): Promise<{
    status: number
  }>

  getNumerationByCouncil(councilId: number): Promise<NumerationModel>

  processDocuments(id: number): Promise<{
    documentsRecopilated: number
    mergedDocument: boolean
  }>

  generateRecord(id: number): Promise<{ record: string }>

  downloadDocument(id: number): Promise<void>
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
      return { documents: [], count: 0 }
    }

    return result.data as {
      documents: DocumentModel[]
      count: number
    }
  }

  create = async (document: DocumentModel) => {
    const result = await AxiosClient.post(API_ROUTES.DOCUMENTS.CREATE, document)

    if ('error' in result) {
      return {} as DocumentModel
    }

    return result.data as DocumentModel
  }

  getAll = async () => {
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.GET_ALL)

    if ('error' in result) {
      return { documents: [], count: 0 }
    }

    return result.data as {
      documents: DocumentModel[]
      count: number
    }
  }

  deleteById = async (id: number) => {
    const result = await AxiosClient.delete({
      path: API_ROUTES.DOCUMENTS.DELETE.replace(':id', id.toString()),
    })

    if ('error' in result) {
      return { status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR }
    }

    return result.data as { status: number }
  }

  getNumerationByCouncil = async (councilId: number) => {
    const result = await AxiosClient.get(
      API_ROUTES.DOCUMENT_NUMERATION.GET_BY_COUNCIL,
      {
        params: { councilId },
      },
    )

    if ('error' in result) {
      return {} as NumerationModel
    }

    return result.data as NumerationModel
  }

  processDocuments = async (id: number) => {
    const result = await AxiosClient.post(API_ROUTES.DOCUMENTS.PROCESS(id))

    console.log(result)

    if ('error' in result) {
      return { documentsRecopilated: 0, mergedDocument: false }
    }

    return result.data as {
      documentsRecopilated: number
      mergedDocument: boolean
    }
  }

  generateRecord = async (id: number) => {
    const result = await AxiosClient.post(
      API_ROUTES.DOCUMENTS.GENERATE_RECORD(id),
    )

    console.log(result)

    if ('error' in result) {
      return { record: '' }
    }

    return result.data as { record: string }
  }

  downloadDocument = async (id: number) => {
    const result = await AxiosClient.get(API_ROUTES.DOCUMENTS.DOWNLOAD(id))
    console.log(result)
  }
}
