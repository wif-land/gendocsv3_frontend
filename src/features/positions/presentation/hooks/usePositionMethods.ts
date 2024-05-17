import { usePositionStore } from '../state/usePositionStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { PositionUseCasesImpl } from '../../domain/usecases/PositionServices'
import { PositionModel } from '../../data/models/PositionModel'

export const useFunctionaryMethods = () => {
  const { positions, setPositions } = usePositionStore()
  const { loader } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    const response = await PositionUseCasesImpl.getInstance().getAll(
      rowsPerPage,
      currentPage * rowsPerPage,
    )

    return response as {
      positions: PositionModel[]
      count: number
    }
  }

  const deleteRow = async (id: number) =>
    await PositionUseCasesImpl.getInstance().delete(id)

  const deleteManyRows = async (ids: number[]) =>
    await PositionUseCasesImpl.getInstance().deleteMany(ids)

  const fetchDataByField = async (
    searchTerm: string,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await PositionUseCasesImpl.getInstance().getByField(
      searchTerm,
      rowsPerPage,
      currentPage * rowsPerPage,
    )

  return {
    loader,
    positions,
    setPositions,
    fetchData,
    deleteRow,
    deleteManyRows,
    fetchDataByField,
  }
}
