import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'
import { HTTP_STATUS_CODES } from '../../../../shared/utils/app-enums'
import { CareerModel } from '../../data/models/CareerModel'
import { useCareersStore } from '../state/careerStore'

export const useCareerCommands = () => {
  const { careers } = useCareersStore()
  const { loader, addLoaderItem, removeLoaderItem } = useLoaderStore()

  const fetchData = async () => {
    addLoaderItem('careers')
    try {
      const response = await CareersUseCasesImpl.getInstance().getAll()
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.careers
      }
    } catch (error) {
      return {
        careers: [],
        count: 0,
      }
    } finally {
      removeLoaderItem('careers')
    }
  }

  const updateRow = async (student: Partial<CareerModel>) => {
    addLoaderItem('careers')
    try {
      const response = await CareersUseCasesImpl.getInstance().update(
        student.id as number,
        {
          isActive: !student.isActive,
        },
      )
      if (response.status === HTTP_STATUS_CODES.OK) {
        return response.career as CareerModel
      }
    } catch (error) {
      return null
    } finally {
      removeLoaderItem('careers')
    }
  }

  return {
    loader,
    careers,
    fetchData,
    updateRow,
  }
}
