import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { CouncilsUseCasesImpl } from '../../domain/usecases/CouncilServices'
import { ICouncil } from '../../domain/entities/ICouncil'
import { useCouncilStore } from '../store/councilsStore'
import { ICouncilFilters } from '../../domain/entities/ICouncilFilters'

export const useCouncilsMethods = () => {
  const { councils, setCouncils } = useCouncilStore()
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

  const updateRow = async (council: Partial<ICouncil>) =>
    await CouncilsUseCasesImpl.getInstance().update(council.id as number, {
      isActive: !council.isActive,
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
