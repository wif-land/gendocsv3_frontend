'use client'

import * as Yup from 'yup'
import { ICareerTableFilters } from '../components/CareerTableToolbar'
import { ICareer, ICareerFormValues } from '../../domain/entities/ICareer'
import { IFunctionary } from '../../../functionaries/domain/entities/IFunctionary'
import { resolveFormSelectOptions } from '../../../../shared/utils/FormUtil'

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
  credits: Yup.number()
    .required('Campo requerido')
    .max(650, 'El número máximo permitido es 650')
    .min(130, 'El número mínimo permitido es 130'),
  coordinator: Yup.object()
    .shape({
      id: Yup.number().required('Campo requerido'),
      label: Yup.string().required('Campo requerido'),
    })
    .required('Campo requerido'),
  menDegree: Yup.string().required('Campo requerido'),
  womenDegree: Yup.string().required('Campo requerido'),
  internshipHours: Yup.number()
    .required('Campo requerido')
    .max(650, 'El número máximo permitido es 650')
    .min(230, 'El número mínimo permitido es 230'),
  vinculationHours: Yup.number()
    .required('Campo requerido')
    .max(650, 'El número máximo permitido es 650')
    .min(80, 'El número mínimo permitido es 80'),
  moduleName: Yup.string()
    .optional()
    .max(50, 'Máximo 50 caracteres')
    .min(3, 'Mínimo 3 caracteres'),
  moduleCode: Yup.string()
    .optional()
    .max(50, 'Máximo 50 caracteres')
    .min(3, 'Mínimo 3 caracteres'),
})

export const resolveDefaultValues = (
  currentCareer?: ICareer,
): ICareerFormValues => ({
  id: currentCareer ? currentCareer.id : 0,
  name: currentCareer?.name || '',
  credits: currentCareer ? currentCareer.credits : 0,
  menDegree: currentCareer?.menDegree || '',
  womenDegree: currentCareer?.womenDegree || '',
  coordinator: currentCareer?.coordinator
    ? {
        ...currentCareer?.coordinator,
        ...resolveFormSelectOptions(currentCareer?.coordinator),
      }
    : ({ label: '', id: 0 } as IFunctionary & { label: string; id: number }),
  internshipHours: currentCareer ? currentCareer.internshipHours : 0,
  vinculationHours: currentCareer ? currentCareer.vinculationHours : 0,
  isActive: currentCareer ? currentCareer.isActive : true,
})
