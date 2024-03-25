import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { DocumentsRepositoryImpl } from '../../data/repositories/DocumentsRepositoryImpl'
import { IDocument } from '../entities/IDocument'
import { DocumentsRepository } from '../repositories/DocumentsRepository'

interface DocumentUseCases {
  create(process: IDocument): Promise<{
    status: number
    document: DocumentModel
  }>

  getAll(): Promise<{
    status: number
    documents: DocumentModel[]
  }>

  getById(id: number): Promise<{
    status: number
    process: DocumentModel
  }>

  getAllDocumentsByModuleId(
    moduleId: number,
    params: PaginationParams,
  ): Promise<{
    count: number
    documents: DocumentModel[]
  }>

  deleteById(id: number): Promise<{
    status: number
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

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  getAllDocumentsByModuleId = async (
    moduleId: number,
    params: PaginationParams,
  ) => {
    const result = await this.modelRepository.getAllDocumentsByModuleId(
      moduleId,
      params,
    )

    return result.data as { count: number; documents: DocumentModel[] }
  }

  deleteById = async (id: number) => await this.modelRepository.deleteById(id)

  getNumerationByCouncil = async (councilId: number) =>
    await this.modelRepository.getNumerationByCouncil(councilId)
}
