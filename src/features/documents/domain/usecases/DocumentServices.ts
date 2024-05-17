import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { DocumentsRepositoryImpl } from '../../data/repositories/DocumentsRepositoryImpl'
import { IDocument } from '../entities/IDocument'
import { DocumentsRepository } from '../repositories/DocumentsRepository'

interface DocumentUseCases {
  create(process: IDocument): Promise<DocumentModel | boolean>

  getAll(): Promise<{
    documents: DocumentModel[]
  }>

  getAllDocumentsByModuleId(
    moduleId: number,
    params: PaginationParams,
  ): Promise<{
    count: number
    documents: DocumentModel[]
  }>

  getNumerationByCouncil(councilId: number): Promise<NumerationModel>
}

export class DocumentsUseCasesImpl implements DocumentUseCases {
  static instance: DocumentsUseCasesImpl

  static getInstance = (): DocumentsUseCasesImpl => {
    if (!DocumentsUseCasesImpl.instance) {
      DocumentsUseCasesImpl.instance = new DocumentsUseCasesImpl()
    }

    return DocumentsUseCasesImpl.instance
  }

  private modelRepository: DocumentsRepository =
    DocumentsRepositoryImpl.getInstance()

  create = async (document: IDocument) =>
    await this.modelRepository.create(document)

  getAll = async () => await this.modelRepository.getAll()

  getAllDocumentsByModuleId = async (
    moduleId: number,
    params: PaginationParams,
  ) => await this.modelRepository.getAllDocumentsByModuleId(moduleId, params)

  getNumerationByCouncil = async (councilId: number) =>
    await this.modelRepository.getNumerationByCouncil(councilId)
}
