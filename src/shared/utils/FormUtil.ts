/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from 'yup'

type GenericObject = { [key: string]: any }

/**
 * Default props for a person.
 */
export interface DefaultPersonSchemaProps {
  id?: number
  dni: string
  firstName: string
  secondName?: string | null
  firstLastName: string
  secondLastName?: string | null
  personalEmail?: string | null
  outlookEmail: string
  phoneNumber: string
}

/**
 * Compares the initial values with the new values and returns the edited fields.
 * @param initialValues - The initial values of the form.
 * @param values - The new values of the form.
 * @returns The edited fields. If there are no edited fields, it returns null.
 */
export const resolveEditedFields = <T extends GenericObject>(
  initialValues: T,
  values: T,
): T | null => {
  const editedFields: T = {} as T

  Object.keys(initialValues).forEach((key) => {
    // type ARRAY
    if (Array.isArray(initialValues[key])) {
      if (JSON.stringify(initialValues[key]) !== JSON.stringify(values[key])) {
        ;(editedFields as any)[key] = values[key]
      }

      return
    }

    // type OBJECT
    if (typeof initialValues[key] === 'object') {
      if (JSON.stringify(initialValues[key]) !== JSON.stringify(values[key])) {
        ;(editedFields as any)[key] = values[key]
      }

      return
    }

    // primitive types
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

/**
 * Default schema for a person. Intended to be used in forms where a person is required.
 */
export const DEFAULT_PERSON_SCHEMA = yup.object().shape({
  dni: yup.string().required(VALIDATION_MESSAGES.required),
  firstName: yup.string().required(VALIDATION_MESSAGES.required),
  firstLastName: yup.string().required(VALIDATION_MESSAGES.required),
  personalEmail: yup
    .string()
    .email(VALIDATION_MESSAGES.invalidFormat)
    .nullable(),
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

/**
 * Resolves the default schema for a person.
 * @param props - The props to override the default schema.
 * @returns The default schema for a person.
 */
export const resolveDefaultSchema = (
  props?: Partial<DefaultPersonSchemaProps>,
) => ({
  id: props?.id || 0,
  dni: props?.dni || '',
  firstName: props?.firstName || '',
  secondName: props?.secondName || null,
  firstLastName: props?.firstLastName || '',
  secondLastName: props?.secondLastName || null,
  personalEmail: props?.personalEmail || null,
  outlookEmail: props?.outlookEmail || '',
  phoneNumber: props?.phoneNumber || '',
})
