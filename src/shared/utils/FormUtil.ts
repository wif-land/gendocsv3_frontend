/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from 'yup'

type GenericObject = { [key: string]: any }

export interface DefaultPersonSchemaProps {
  id?: number
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  personalEmail: string
  outlookEmail: string
  phoneNumber: string
}

export const getEditedFields = <T extends GenericObject>(
  initialValues: T,
  values: T,
): T | null => {
  const editedFields: T = {} as T

  Object.keys(initialValues).forEach((key) => {
    if (initialValues[key] !== values[key]) {
      ;(editedFields as any)[key] = values[key]
    }
  })

  if (Object.keys(editedFields).length === 0) {
    return null
  }

  return editedFields
}

export const VALIDATION_MESSAGES = {
  required: 'Campo requerido.',
  invalidFormat: 'Formato no válido.',
  invalidPhone: 'Número de teléfono inválido. Ejemplo: 0987654321.',
  noSpaces: 'No se permiten espacios.',
  minLength: (length: number) => `Mínimo ${length} caracteres.`,
  maxLength: (length: number) => `Máximo ${length} caracteres.`,
}

export const resolveFormSelectOptions = <T extends DefaultPersonSchemaProps>(
  data: T,
): { label: string; id: number } => ({
  id: data.id || 0,
  label: `${data.firstName} ${data.secondName} ${data.firstLastName} ${data.secondLastName} - ${data.dni}`,
})

export const DEFAULT_PERSON_SCHEMA = yup.object().shape({
  dni: yup.string().required(VALIDATION_MESSAGES.required),
  firstName: yup.string().required(VALIDATION_MESSAGES.required),
  secondName: yup.string().required(VALIDATION_MESSAGES.required),
  firstLastName: yup.string().required(VALIDATION_MESSAGES.required),
  secondLastName: yup.string().required(VALIDATION_MESSAGES.required),
  personalEmail: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@+[A-Z0-9._%+-]+\.com$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  outlookEmail: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^[A-Z0-9._%+-]+@uta\.edu\.ec$/i,
      VALIDATION_MESSAGES.invalidFormat,
    ),
  phoneNumber: yup
    .string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^0\d{9}$/, VALIDATION_MESSAGES.invalidPhone),
})

export const resolveDefaultSchema = (
  props?: Partial<DefaultPersonSchemaProps>,
) => ({
  id: props?.id || 0,
  dni: props?.dni || '',
  firstName: props?.firstName || '',
  secondName: props?.secondName || '',
  firstLastName: props?.firstLastName || '',
  secondLastName: props?.secondLastName || '',
  personalEmail: props?.personalEmail || '',
  outlookEmail: props?.outlookEmail || '',
  phoneNumber: props?.phoneNumber || '',
})
