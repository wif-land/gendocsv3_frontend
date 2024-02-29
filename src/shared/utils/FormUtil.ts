/* eslint-disable @typescript-eslint/no-explicit-any */
type GenericObject = { [key: string]: any }

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
  noSpaces: 'No se permiten espacios.',
  minLength: (length: number) => `Mínimo ${length} caracteres.`,
  maxLength: (length: number) => `Máximo ${length} caracteres.`,
}
