import useLoaderStore from '@/shared/store/useLoaderStore'
import { useDocumentStore } from '../store/documentsStore'
import { DocumentsDataSourceImpl } from '../../data/datasource/DocumentsDatasource'
import { PaginationDTO } from '@/shared/utils/pagination-dto'
import { IDocumentFilters } from '../components/DocumentTableToolbar'

export const useDocumentsMethods = () => {
  const { documents, setDocuments } = useDocumentStore()
  const { loader } = useLoaderStore()

  const fetchData = async (
    filters: IDocumentFilters,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await DocumentsDataSourceImpl.getInstance().getAllByFilters(
      filters,
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  const deleteDocument = async (id: number) =>
    await DocumentsDataSourceImpl.getInstance().deleteById(id)

  return {
    loader,
    documents,
    setDocuments,
    fetchData,
    deleteDocument,
  }
}
