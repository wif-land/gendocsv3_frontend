/* eslint-disable @typescript-eslint/no-explicit-any */
import { enqueueSnackbar } from 'notistack'

export interface RawFunctionary {
  ['Cédula']: string
  ['Primer Nombre']: string
  ['Primer Apellido']: string
  ['Correo Institucional']: string
  ['Título Tercer Nivel']: string
  ['Título Cuarto Nivel']: string
  ['Segundo Nombre']?: string
  ['Segundo Apellido']?: string
  ['Correo Personal']?: string
  ['Numero de celular']: string
  ['Teléfono Fijo']?: string
}

export const transformData = (data: RawFunctionary[]): any[] =>
  data
    .map((item: RawFunctionary) => {
      if (!item['Cédula']) {
        return
      }

      if (String(item['Cédula']).trim().length !== 10) {
        enqueueSnackbar(
          `Por favor, asegúrate de que la cédula ${item['Cédula']} tenga 10 dígitos`,
          { variant: 'warning' },
        )

        return
      }

      const safeToString = (value: any): string => {
        if (value === null || value === undefined) return ''
        return value.toString()
      }

      const capitalizeFirstLetter = (str: string): string => {
        if (!str) return str
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
      }

      const capitalizeSentence = (str: string): string => {
        if (!str) return str
        return str
          .split(' ')
          .map((word) => capitalizeFirstLetter(word))
          .join(' ')
      }

      return {
        dni: item['Cédula'],
        firstName: capitalizeSentence(item['Primer Nombre'] || ''),
        secondName: capitalizeSentence(item['Segundo Nombre'] || ''),
        firstLastName: capitalizeSentence(item['Primer Apellido'] || ''),
        secondLastName: capitalizeSentence(item['Segundo Apellido'] || ''),
        outlookEmail: item['Correo Institucional'],
        personalEmail: safeToString(item['Correo Personal']),
        phoneNumber: item['Numero de celular'] || '',
        regularPhoneNumber: item['Teléfono Fijo'] || '',
        thirdLevelDegree: safeToString(item['Título Tercer Nivel']),
        fourthLevelDegree: safeToString(item['Título Cuarto Nivel']),
        isActive: true,
      }
    })
    .filter((item) => item !== undefined)
