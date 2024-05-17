import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { IDocument } from '../entities/IDocument'

export interface DocumentsRepository {
  getAll: () => Promise<{
    documents: DocumentModel[]
  }>

  create: (processData: IDocument) => Promise<DocumentModel>

  getAllDocumentsByModuleId: (
    moduleId: number,
    params: PaginationParams,
  ) => Promise<{
    count: number
    documents: DocumentModel[]
  }>

  deleteById: (id: number) => Promise<boolean>

  getNumerationByCouncil: (councilId: number) => Promise<NumerationModel>
}
