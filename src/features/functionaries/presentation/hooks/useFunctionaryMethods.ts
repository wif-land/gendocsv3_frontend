import { useFunctionaryStore } from '../state/useFunctionaryStore'
import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { FunctionaryUseCasesImpl } from '../../domain/usecases/FunctionaryServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { FunctionaryModel } from '../../data/models/FunctionatyModel'

export const useFunctionaryMethods = () => {
  const { functionaries, setFunctionaries } = useFunctionaryStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async (rowsPerPage: number, currentPage: number) => {
    addLoaderItem('functionaries')
    try {
      const response = await FunctionaryUseCasesImpl.getInstance().getAll(
        rowsPerPage,
        currentPage * rowsPerPage,
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.data as {
          functionaries: FunctionaryModel[]
          count: number
        }
      }
    } catch (error) {
      return {
        functionaries: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('functionaries')
    }
  }

  const updateRow = async (functionary: Partial<FunctionaryModel>) => {
    addLoaderItem('functionaries')
    try {
      const response = await FunctionaryUseCasesImpl.getInstance().update(
        functionary.id as number,
        {
          isActive: !functionary.isActive,
        },
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.functionary as FunctionaryModel
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('functionaries')
    }
  }

  const updateRows = async (functionaries: Partial<FunctionaryModel>[]) => {
    addLoaderItem('functionaries')
    try {
      const response =
        await FunctionaryUseCasesImpl.getInstance().bulkUpdate(functionaries)
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.functionaries as FunctionaryModel[]
      }
    } catch (error) {
      return []
    } finally {
      removeLoaderItem('functionaries')
    }
  }

  const fetchDataByField = async (
    searchTerm: string,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('functionaries')
    try {
      const response = await FunctionaryUseCasesImpl.getInstance().getByField(
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
          data: { count: number; functionaries: FunctionaryModel[] }
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          functionaries: [],
        },
      }
    } finally {
      removeLoaderItem('functionaries')
    }
  }

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
