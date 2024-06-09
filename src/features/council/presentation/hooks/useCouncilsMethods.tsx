import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { IUpdateCouncil } from '../../domain/entities/ICouncil'
import { useCouncilsStore } from '../store/councilsStore'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'
import { CouncilRepositoryImpl } from '../../data/repositories/CouncilRepositoryImpl'

export const useCouncilsMethods = () => {
  const { councils, setCouncils } = useCouncilsStore()
  const { loader } = useLoaderStore()

  const fetchData = async (
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await CouncilsUseCasesImpl.getInstance().getAllCouncilsByModuleId(
      moduleId,
      rowsPerPage,
      currentPage * rowsPerPage,
    )

  const updateRow = async (council: IUpdateCouncil) =>
    await CouncilRepositoryImpl.getInstance().update({
      id: council.id as number,
      isActive: council.isActive,
    })

  const fetchDataByField = async (
    filters: ICouncilFilters,
    moduleId: number,
    rowsPerPage: number,
    currentPage: number,
  ) =>
    await CouncilsUseCasesImpl.getInstance().getByFilters(
      filters,
      moduleId,
      rowsPerPage,
      currentPage * rowsPerPage,
    )

  return {
    loader,
    councils,
    setUsers: setCouncils,
    fetchData,
    updateRow,
    fetchDataByField,
  }
}
