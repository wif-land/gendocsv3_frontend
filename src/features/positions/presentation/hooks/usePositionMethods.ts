import { usePositionStore } from '../state/usePositionStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { PositionUseCasesImpl } from '../../domain/usecases/PositionServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { PositionModel } from '../../data/models/PositionModel'

export const useFunctionaryMethods = () => {
  const { positions, setPositions } = usePositionStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    addLoaderItem('positions')
    try {
      const response = await PositionUseCasesImpl.getInstance().getAll(
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.data as {
          positions: PositionModel[]
          count: number
        }
      }
    } catch (error) {
      return {
        positions: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('positions')
    }
  }

  const deleteRow = async (id: number) => {
    addLoaderItem('positions')
    try {
      const response = await PositionUseCasesImpl.getInstance().delete(id)
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.isDeleted
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('positions')
    }
  }

  const deleteManyRows = async (ids: number[]) => {
    addLoaderItem('positions')
    try {
      const response = await PositionUseCasesImpl.getInstance().deleteMany(ids)
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.isDeleted
      }
    } catch (error) {
      return []
    } finally {
      removeLoaderItem('positions')
    }
  }

  const fetchDataByField = async (
    searchTerm: string,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('positions')
    try {
      const response = await PositionUseCasesImpl.getInstance().getByField(
        searchTerm,
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (
        response.status === HTTP_STATUS_CODES.OK ||
        response.status === HTTP_STATUS_CODES.NOT_FOUND
      ) {
        return response as {
          status: number
          data: { count: number; positions: PositionModel[] }
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          positions: [],
        },
      }
    } finally {
      removeLoaderItem('positions')
    }
  }

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
