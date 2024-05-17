import useLoaderStore from '../../../../shared/store/useLoaderStore'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'
import { CareerModel } from '../../data/models/CareerModel'
import { useCareersStore } from '../store/careerStore'

export const useCareerMethods = () => {
  const { careers } = useCareersStore()
  const { loader } = useLoaderStore()

  const fetchData = async () => await CareersUseCasesImpl.getInstance().getAll()

  const updateRow = async (student: Partial<CareerModel>) =>
    await CareersUseCasesImpl.getInstance().update(student.id as number, {
      isActive: !student.isActive,
    })

  return {
    loader,
    careers,
    fetchData,
    updateRow,
  }
}
