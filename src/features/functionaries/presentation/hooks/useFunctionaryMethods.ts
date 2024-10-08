import { useFunctionaryStore } from '../state/useFunctionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { FunctionaryUseCasesImpl } from '../../domain/usecases/FunctionaryServices'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'
import { IFunctionaryFilters } from '../../domain/entities/IFunctionaryFilters'
import { PaginationDTO } from '../../../../shared/utils/pagination-dto'

export const useFunctionaryMethods = () => {
  const { functionaries, setFunctionaries } = useFunctionaryStore()
  const { loader } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) =>
    await FunctionaryUseCasesImpl.getInstance().getAll(
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  const updateRow = async (functionary: Partial<FunctionaryModel>) =>
    await FunctionaryUseCasesImpl.getInstance().update(
      functionary.id as number,
      {
        isActive: !functionary.isActive,
      },
    )

  const updateRows = async (functionaries: Partial<FunctionaryModel>[]) =>
    await FunctionaryUseCasesImpl.getInstance().bulkUpdate(functionaries)

  const fetchDataByField = async (
    filters: IFunctionaryFilters,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await FunctionaryUseCasesImpl.getInstance().getByFilters(
      filters,
      new PaginationDTO(
        (currentPage * rowsPerPage) / rowsPerPage + 1,
        rowsPerPage,
      ),
    )

  return {
    loader,
    functionaries,
    setFunctionaries,
    fetchData,
    updateRow,
    updateRows,
    fetchDataByField,
  }
}
