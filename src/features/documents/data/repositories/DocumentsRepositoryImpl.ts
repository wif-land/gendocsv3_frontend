import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
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

  getAllDocumentsByModuleId = async (moduleId: number, params: PaginationDTO) =>
    await this.datasource.getAllDocumentsByModuleId(moduleId, params)

  getAll = async () => await this.datasource.getAll()

  getAllByStudentId = async (studentId: number) =>
    await this.datasource.getAllByStudentId(studentId)

  create = async (processData: IDocument) =>
    await this.datasource.create(processData)

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

  getNumerationByCouncil = async (councilId: number) =>
    await this.datasource.getNumerationByCouncil(councilId)
}
