import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IDocument } from '../../domain/entities/IDocument'
import { DocumentsRepository } from '../../domain/repositories/DocumentsRepository'
import {
  DocumentsDataSource,
  DocumentsDataSourceImpl,
} from '../datasource/DocumentsDatasource'
import { DocumentModel } from '../models/DocumentsModel'

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
    const { success } = result

    if (!success) {
      return false
    }

    return result.data?.document as DocumentModel
  }

  deleteById = async (id: number) => {
    try {
      const result = await this.datasource.deleteById(id)
      const { status } = result
      if (status !== HTTP_STATUS_CODES.OK) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }

  getNumerationByCouncil = async (councilId: number) => {
    const result = await this.datasource.getNumerationByCouncil(councilId)

    return result.data
  }
}
