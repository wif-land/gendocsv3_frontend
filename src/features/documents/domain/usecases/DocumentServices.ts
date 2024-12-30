import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { DocumentsRepositoryImpl } from '../../data/repositories/DocumentsRepositoryImpl'
import { IDocumentFilters } from '../../presentation/components/DocumentTableToolbar'
import { IDocument } from '../entities/IDocument'
import { DocumentsRepository } from '../repositories/DocumentsRepository'

interface DocumentUseCases {
  create(process: IDocument): Promise<DocumentModel | boolean>

  getAll(): Promise<{
    documents: DocumentModel[]
  }>

  getAllDocumentsByFilters(
    filters: IDocumentFilters,
    params: PaginationDTO,
  ): Promise<{
    count: number
    documents: DocumentModel[]
  }>

  getAllByStudentId(studentId: number): Promise<{
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

  getAllDocumentsByFilters = async (
    filters: IDocumentFilters,
    params: PaginationDTO,
  ) => await this.modelRepository.getAllDocumentsByFilters(filters, params)

  getNumerationByCouncil = async (councilId: number) =>
    await this.modelRepository.getNumerationByCouncil(councilId)

  getAllByStudentId = async (studentId: number) =>
    await this.modelRepository.getAllByStudentId(studentId)
}
