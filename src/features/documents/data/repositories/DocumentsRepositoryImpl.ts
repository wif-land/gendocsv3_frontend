import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { IDocument } from '../../domain/entities/IDocument'
import { ModelsRepository } from '../../domain/repositories/DocumentsRepository'
import {
  DocumentsDataSource,
  DocumentsDataSourceImpl,
} from '../datasource/DocumentsDatasource'
import { DocumentModel } from '../models/DocumentsModel'

export class ModelsRepositoryImpl implements ModelsRepository {
  static instance: ModelsRepositoryImpl

  static getInstance = (): ModelsRepositoryImpl => {
    if (!ModelsRepositoryImpl.instance) {
      ModelsRepositoryImpl.instance = new ModelsRepositoryImpl(
        DocumentsDataSourceImpl.getInstance(),
      )
    }

    return ModelsRepositoryImpl.instance
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
        return { status, process: {} as DocumentModel }
      }

      return { status, process: result.process }
    } catch (error) {
      return { status: 500, process: {} as DocumentModel }
    }
  }
}
