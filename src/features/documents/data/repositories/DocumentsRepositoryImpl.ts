import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IDocument } from '../../domain/entities/IDocument'
import { DocumentsRepository } from '../../domain/repositories/DocumentsRepository'
import {
  DocumentsDataSource,
  DocumentsDataSourceImpl,
} from '../datasource/DocumentsDatasource'

export class DocumentsRepositoryImpl implements DocumentsRepository {
  static instance: DocumentsRepositoryImpl

  static getInstance = (): DocumentsRepositoryImpl => {
    if (!DocumentsRepositoryImpl.instance) {
      DocumentsRepositoryImpl.instance = new DocumentsRepositoryImpl(
        DocumentsDataSourceImpl.getInstance(),
      )
    }

    return DocumentsRepositoryImpl.instance
  }

  private constructor(private readonly datasource: DocumentsDataSource) {}

  getAllDocumentsByModuleId = async (
    moduleId: number,
    params: PaginationParams,
  ) => await this.datasource.getAllDocumentsByModuleId(moduleId, params)

  getAll = async () => await this.datasource.getAll()

  create = async (processData: IDocument) => {
    const result = await this.datasource.create(processData)
    const { status } = result

    return { status, document: result.document }
  }

  deleteById = async (id: number) => {
    try {
      const result = await this.datasource.deleteById(id)
      const { status } = result
      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status }
      }
      return { status }
    } catch (error) {
      return { status: 500 }
    }
  }

  getNumerationByCouncil = async (councilId: number) => {
    const result = await this.datasource.getNumerationByCouncil(councilId)

    return result.data
  }
}
