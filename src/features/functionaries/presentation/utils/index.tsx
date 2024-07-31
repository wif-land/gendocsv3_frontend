/* eslint-disable @typescript-eslint/no-explicit-any */
import { DegreeModel } from '../../../../core/providers/data/models/degreeModel'
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

export const transformData = (
  data: RawFunctionary[],
  degrees: DegreeModel[],
): any[] =>
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

      const thirdLevelDegree = getDegreeFunctionary(
        safeToString(item['Título Tercer Nivel']),
        degrees,
        safeToString(item['Cédula']),
      )

      const fourthLevelDegree = getDegreeFunctionary(
        safeToString(item['Título Cuarto Nivel']),
        degrees,
        safeToString(item['Cédula']),
      )

      if (!thirdLevelDegree || !fourthLevelDegree) {
        return
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
        thirdLevelDegree,
        fourthLevelDegree,
        isActive: true,
      }
    })
    .filter((item) => item !== undefined)

const getDegreeFunctionary = (
  inputDegree: string,
  degrees: DegreeModel[],
  funtionaryDni: string,
): number | undefined => {
  const degree = degrees.find(
    (degree) =>
      degree.abbreviation.toUpperCase() === inputDegree.trim().toUpperCase(),
  )

  if (!degree) {
    enqueueSnackbar(
      `No se encontró el título: ${inputDegree} para el funcionario con Cédula ${funtionaryDni}`,
      {
        variant: 'error',
      },
    )
    return
  }

  return degree.id
}
