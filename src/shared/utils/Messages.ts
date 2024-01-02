export const VALIDATION_MESSAGES = {
  required: 'Campo requerido.',
  invalidFormat: 'Formato no válido.',
  noSpaces: 'No se permiten espacios.',
  minLength: (length: number) => `Mínimo ${length} caracteres.`,
  maxLength: (length: number) => `Máximo ${length} caracteres.`,
}
