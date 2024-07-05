import { enqueueSnackbar } from 'notistack'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { StudentModel } from '../../data/models/StudentModel'
import { IStudent } from '../../domain/entities/IStudent'
import { ICanton } from '../../../../core/providers/domain/entities/ILocationProvider'

const alternativeCities = {
  'SANTIAGO DE PILLARO': 'SANTIAGO DE PÍLLARO',
  'EL CÁRMEN': 'EL CARMEN',
  TULCAN: 'TULCÁN',
  TRUJILLO: 'LA LIBERTAD',
  'LA JOYA D LOS SACHAS': 'LA JOYA DE LOS SACHAS',
  '': 'AMBATO',
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformData = (
  data: any[],
  careers: ICareer[],
  canton: ICanton[],
): IStudent[] =>
  data
    .map((item: any) => {
      if (!item['Cédula']) {
        // enqueueSnackbar(
        //   'Por favor, asegúrate de que el estudiante tenga una cédula válida',
        //   { variant: 'warning' },
        // )

        return
      }

      if (String(item['Cédula']).length !== 10) {
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

      let firstName = ''
      let secondName = ''
      let firstLastName = ''
      let secondLastName = ''

      if (item['Nombres']) {
        const names = safeToString(item['Nombres']).split(' ')
        firstName = names[0] && names[0].trim()
        secondName = names[1] ? names[1].trim() : ''
      } else {
        firstName = safeToString(item['Primer Nombre']).trim()
        secondName = safeToString(item['Segundo Nombre']).trim()
      }

      if (item['Apellidos']) {
        const lastNames = safeToString(item['Apellidos']).split(' ')
        firstLastName = lastNames[0] && lastNames[0].trim()
        secondLastName = lastNames[1] ? lastNames[1].trim() : ''
      } else {
        firstLastName = safeToString(item['Primer Apellido']).trim()
        secondLastName = safeToString(item['Segundo Apellido']).trim()
      }

      const getBachelorDegree = () => {
        if (item['Título']) {
          if (item['Especialidad']) {
            return `Bachiller ${item['Título']
              ?.toString()
              .trim()} Especialidad En ${item['Especialidad']
              ?.toString()
              .trim()}`
          }
          return `Bachiller ${item['Título']?.toString().trim()}`
        } else {
          if (item['Especialidad']) {
            return `Especialidad en ${item['Especialidad'].toString().trim()}`
          }
        }
        return ''
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

      if (item['Correo'] && item['Fecha Nacimiento']) {
        let career = careers.find(
          (career: ICareer) => career.name === item['Carrera'],
        )?.id as number

        if (item['Carrera'] === 'ING. EN SISTEMAS COMPUTAC.E INFORMATICOS') {
          career = careers.find(
            (career: ICareer) =>
              career.name ===
              'Ingeniería en Sistemas Computacionales e Informáticos',
          )?.id as number
        }

        let cityString: string = item['Cantón'].toUpperCase().trim()
        if (
          Object.keys(alternativeCities).find((city) => city === cityString)
        ) {
          cityString =
            alternativeCities[cityString as keyof typeof alternativeCities]
        }

        let city = canton.find(
          (city: ICanton) => city.name.toUpperCase() === cityString,
        )

        if (city == null) {
          // enqueueSnackbar(
          //   `Cantón ${item['Cantón']} no encontrado para ${item['Cédula']}`,
          //   {
          //     variant: 'warning',
          //   },
          // )
          // return

          cityString = 'AMBATO'

          city = canton.find(
            (city: ICanton) => city.name.toUpperCase() === cityString,
          )
        }
        return {
          firstName,
          secondName,
          firstLastName,
          secondLastName,
          outlookEmail: item['Correo UTA']?.toString().trim(),
          personalEmail: item['Correo']?.toString().trim(),
          phoneNumber: item['Celular']?.toString().trim(),
          regularPhoneNumber: item['Teléfono']?.toString().trim(),
          dni: item['Cédula'].toString().trim(),
          folio: item['Folio']?.toString().trim(),
          gender: item['Género']?.toString().trim(),
          bachelorDegree: capitalizeSentence(getBachelorDegree()),
          registration: item['Matrícula']?.toString()?.trim() || '',
          birthdate: item['Fecha Nacimiento'],
          canton: city?.id as number,
          isActive: true,
          career,
        } as StudentModel
      } else if (item['Horas Vinculación'] && item['Horas Prácticas']) {
        return {
          firstName,
          secondName,
          firstLastName,
          secondLastName,
          dni: item['Cédula'].toString().trim(),
          vinculationHours: parseInt(item['Horas Vinculación'], 10) || 0,
          internshipHours: parseInt(item['Horas Prácticas'], 10) || 0,
        } as StudentModel
      } else {
        return {
          firstName,
          secondName,
          firstLastName,
          secondLastName,
          dni: item['Cédula'].toString(),
          startStudiesDate: item['Inicio clases'] || new Date(),
          endStudiesDate: item['Fin clases'] || new Date(),
          approvedCredits: parseInt(item['Créditos Carrera'], 10) || 0,
          bachelorDegree: capitalizeSentence(getBachelorDegree()),
        } as StudentModel
      }
    })
    .filter((item) => item !== undefined)
