import { DocumentModel } from '../../data/models/DocumentsModel'
import { ModelsRepositoryImpl } from '../../data/repositories/DocumentsRepositoryImpl'
import { IDocument } from '../entities/IDocument'
import { ModelsRepository } from '../repositories/DocumentsRepository'

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
}

export class DocumentsUseCasesImpl implements DocumentUseCases {
  static instance: DocumentsUseCasesImpl

  static getInstance = (): DocumentsUseCasesImpl => {
    if (!DocumentsUseCasesImpl.instance) {
      DocumentsUseCasesImpl.instance = new DocumentsUseCasesImpl()
    }

    return DocumentsUseCasesImpl.instance
  }

  private processRepository: ModelsRepository =
    ModelsRepositoryImpl.getInstance()

  create = async (process: IDocument) =>
    await this.processRepository.create(process)

  getAll = async () => await this.processRepository.getAll()

  getById = async (id: number) => {
    throw new Error(`Method not implemented.${id}`)
  }

  update = async (id: number, process: Partial<DocumentModel>) =>
    await this.processRepository.update({
      ...process,
      id,
    })

  getAllProcessesByModuleId = async (moduleId: number) =>
    await this.processRepository.getAllDocumentsByModuleId(moduleId)
}
