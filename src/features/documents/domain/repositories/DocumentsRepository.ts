import { PaginationDTO } from '../../../../shared/utils/pagination-dto'
import { DocumentModel } from '../../data/models/DocumentsModel'
import { NumerationModel } from '../../data/models/NumerationModel'
import { IDocumentFilters } from '../../presentation/components/DocumentTableToolbar'
import { IDocument } from '../entities/IDocument'

export interface DocumentsRepository {
  getAll: () => Promise<{
    documents: DocumentModel[]
  }>

  create: (processData: IDocument) => Promise<DocumentModel>

  getAllDocumentsByFilters: (
    filters: IDocumentFilters,
    params: PaginationDTO,
  ) => Promise<{
    count: number
    documents: DocumentModel[]
  }>

  getAllByStudentId(studentId: number): Promise<{
    documents: DocumentModel[]
  }>

  deleteById: (id: number) => Promise<boolean>

  getNumerationByCouncil: (councilId: number) => Promise<NumerationModel>
}
