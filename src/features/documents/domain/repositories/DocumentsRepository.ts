import { DefaultResponse } from '../../../../core/utils/default-response'
import { PaginationParams } from '../../../../shared/utils/PaginationUtil'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { IDocument } from '../entities/IDocument'

export interface DocumentsRepository {
  getAll: () => Promise<{
    status: number
    documents: DocumentModel[]
  }>

  create: (processData: IDocument) => Promise<DocumentModel | boolean>

  getAllDocumentsByModuleId: (
    moduleId: number,
    params: PaginationParams,
  ) => Promise<DefaultResponse<DocumentModel[]>>

  deleteById: (id: number) => Promise<boolean>

  getNumerationByCouncil: (councilId: number) => Promise<NumerationModel>
}
