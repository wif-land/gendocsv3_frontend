import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { IDocument } from '../entities/IDocument'

export interface DocumentsRepository {
  getAll: () => Promise<{
    status: number
    processes: DocumentModel[]
  }>

  update: (data: Partial<IDocument>) => Promise<{
    status: number
  }>

  create: (processData: IDocument) => Promise<{
    status: number
    process: DocumentModel
  }>

  getAllDocumentsByModuleId: (moduleId: number) => Promise<{
    status: number
    processes: DocumentModel[]
  }>

  deleteById: (id: number) => Promise<{
    status: number
  }>

  getNumerationByCouncil: (councilId: number) => Promise<{
    status: number
    process: NumerationModel
  }>
}
