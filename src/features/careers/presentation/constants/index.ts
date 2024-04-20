'use client'

import * as Yup from 'yup'
import { ICareerTableFilters } from '../components/CareerTableToolbar'
import { ICareer } from '../../domain/entities/ICareer'
import { CareersUseCasesImpl } from '../../domain/usecases/CareerServices'
import { enqueueSnackbar } from 'notistack'
import { useCareersStore } from '../store/careerStore'

export interface FormValuesProps extends ICareer {}

export const TABLE_HEAD = [
  { id: 'name', label: 'Carrera' },
  { id: 'credits', label: 'Créditos', width: 160 },
  { id: 'internshipHours', label: 'Horas de prácticas', width: 160 },
  { id: 'vinculationHours', label: 'Horas de Vinculación', width: 260 },
  { id: 'isActive', label: 'Estado', width: 100 },
  { id: 'actions', label: 'Acciones', width: 110 },
]

export const defaultFilters: ICareerTableFilters = {
  name: undefined,
  state: undefined,
}

export const NewCareerSchema = Yup.object().shape({
  name: Yup.string().required('Campo requerido'),
  credits: Yup.number().required('Campo requerido').max(140).min(130),
  coordinator: Yup.string().required('Campo requerido'),
  menDegree: Yup.string().required('Campo requerido'),
  womenDegree: Yup.string().required('Campo requerido'),
  internshipHours: Yup.number().required('Campo requerido').max(250).min(230),
  vinculationHours: Yup.number().required('Campo requerido').max(95).min(80),
})

export const handleCreate = async (values: FormValuesProps) => {
  const { addCareer } = useCareersStore()
  const result = await CareersUseCasesImpl.getInstance().create(values)

  if (!result) {
    enqueueSnackbar('Error al crear la carrera', {
      variant: 'error',
    })
    return
  }
  addCareer(result)
  enqueueSnackbar('Carrera creada exitosamente'), { variant: 'success' }
}

export const handleUpdate = async (
  id: number,
  editedFields: Partial<ICareer>,
) => {
  const { updateCareer } = useCareersStore()
  const status = await CareersUseCasesImpl.getInstance().update(
    id,
    editedFields,
  )

  if (status) {
    updateCareer(editedFields)
    enqueueSnackbar('Carrera actualizada exitosamente')
  } else {
    throw new Error('Error al actualizar el consejo')
  }
}
