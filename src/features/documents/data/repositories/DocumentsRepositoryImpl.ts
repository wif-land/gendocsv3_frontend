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

  getAllDocumentsByModuleId = async (moduleId: number) =>
    await this.datasource.getAllDocumentsByModuleId(moduleId)

  getAll = async () => await this.datasource.getAll()

  update = async (data: Partial<DocumentModel>) =>
    await this.datasource.update(data)

  create = async (processData: IDocument) => {
    try {
      const result = await this.datasource.create(processData)
      const { status } = result

      if (status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        return { status, document: {} as DocumentModel }
      }

      return { status, document: result.document }
    } catch (error) {
      return { status: 500, document: {} as DocumentModel }
    }
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

  getNumerationByCouncil = async (councilId: number) =>
    await this.datasource.getNumerationByCouncil(councilId)
}
