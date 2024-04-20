import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { DefaultMembersUseCasesImpl } from '../../domain/usecases/DefaultMemberServices'
import { ICouncil } from '../../domain/entities/DefaultMembers'
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
        await DefaultMembersUseCasesImpl.getInstance().getAllCouncilsByModuleId(
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
      const response = await DefaultMembersUseCasesImpl.getInstance().update(
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
    filters: ICouncilFilters,
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) => {
    addLoaderItem('councils')
    try {
      const response =
        await DefaultMembersUseCasesImpl.getInstance().getByFilters(
          filters,
          moduleId,
          rowsPerPage,
          currentPage * rowsPerPage,
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
