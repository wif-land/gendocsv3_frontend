import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { ICouncil } from '../../domain/entities/ICouncil'
import { useCouncilStore } from '../store/councilsStore'
import { enqueueSnackbar } from 'notistack'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'

export const useCouncilsMethods = () => {
  const { councils, setCouncils } = useCouncilStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async (
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('councils')
    try {
      const response =
        await CouncilsUseCasesImpl.getInstance().getAllCouncilsByModuleId(
          moduleId,
          rowsPerPage,
          currentPage * rowsPerPage,
        )

      if (response.status !== HTTP_STATUS_CODES.OK) {
        return {
          councils: [],
          count: 0,
        }
      }

      return response.data
    } catch (error) {
      enqueueSnackbar('No encontramos consejos', {
        variant: 'info',
      })
      return {
        councils: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('councils')
    }
  }

  const updateRow = async (council: Partial<ICouncil>) => {
    addLoaderItem('councils')
    try {
      const response = await CouncilsUseCasesImpl.getInstance().update(
        council.id as number,
        {
          isActive: !council.isActive,
        },
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.council as ICouncil
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('councils')
    }
  }

  const fetchDataByField = async (
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
    filters: ICouncilFilters,
  ) => {
    addLoaderItem('councils')
    try {
      const response = await CouncilsUseCasesImpl.getInstance().getByFilters(
        moduleId,
        rowsPerPage,
        currentPage * rowsPerPage,
        filters,
      )
      if (
        response.status === HTTP_STATUS_CODES.OK ||
        response.status === HTTP_STATUS_CODES.NOT_FOUND
      ) {
        return response as {
          status: number
          data: { count: number; councils: ICouncil[] }
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          count: 0,
          councils: [],
        },
      }
    } finally {
      removeLoaderItem('councils')
    }
  }

  return {
    loader,
    councils,
    setUsers: setCouncils,
    fetchData,
    updateRow,
    fetchDataByField,
  }
}
