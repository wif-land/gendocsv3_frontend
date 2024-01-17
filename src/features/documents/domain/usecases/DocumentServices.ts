import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { DocumentsRepositoryImpl } from '../../data/repositories/DocumentsRepositoryImpl'
import { IDocument } from '../entities/IDocument'
import { DocumentsRepository } from '../repositories/DocumentsRepository'

interface DocumentUseCases {
  create(process: IDocument): Promise<{
    status: number
    process: DocumentModel
  }>

  getAll(): Promise<{
    status: number
    processes: DocumentModel[]
  }>

  getById(id: number): Promise<{
    status: number
    process: DocumentModel
  }>

  update(
    id: number,
    process: Partial<DocumentModel>,
  ): Promise<{
    status: number
  }>

  getAllProcessesByModuleId(moduleId: number): Promise<{
    status: number
    processes: DocumentModel[]
  }>

  deleteById(id: number): Promise<{
    status: number
  }>

  getNumerationByCouncil(councilId: number): Promise<{
    status: number
    process: NumerationModel
  }>
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

  create = async (process: IDocument) =>
    await this.modelRepository.create(process)

  getAll = async () => await this.modelRepository.getAll()

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  update = async (id: number, process: Partial<DocumentModel>) =>
    await this.modelRepository.update({
      ...process,
      id,
    })

  getAllProcessesByModuleId = async (moduleId: number) =>
    await this.modelRepository.getAllDocumentsByModuleId(moduleId)

  deleteById = async (id: number) => await this.modelRepository.deleteById(id)

  getNumerationByCouncil = async (councilId: number) =>
    await this.modelRepository.getNumerationByCouncil(councilId)
}
