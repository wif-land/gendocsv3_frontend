import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { IDocument } from '../entities/IDocument'

export interface DefaultResponse<T> {
  status: number
  data: {
    count: number
    [key: string]: T | number
  }
}

export interface DocumentsRepository {
  getAll: () => Promise<{
    status: number
    documents: DocumentModel[]
  }>

  update: (data: Partial<IDocument>) => Promise<{
    status: number
  }>

  create: (processData: IDocument) => Promise<{
    status: number
    document: DocumentModel
  }>

  getAllDocumentsByModuleId: (
    moduleId: number,
    params: PaginationParams,
  ) => Promise<DefaultResponse<DocumentModel[]>>

  deleteById: (id: number) => Promise<{
    status: number
  }>

  getNumerationByCouncil: (councilId: number) => Promise<NumerationModel>
}
