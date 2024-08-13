import { enqueueSnackbar } from 'notistack'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { StudentModel } from '../../data/models/StudentModel'
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
): any =>
  data
    .map((item: any, index: number) => {
      try {
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

        if (item['Correo'] && !item['Correo'].trim().includes('@')) {
          enqueueSnackbar(
            `Por favor, asegúrate de que el correo ${item['Correo']} sea válido`,
            { variant: 'warning' },
          )

          return
        }

        if (item['Correo UTA'] && !item['Correo UTA'].trim().includes('@')) {
          enqueueSnackbar(
            `Por favor, asegúrate de que el correo ${item['Correo UTA']} sea válido`,
            { variant: 'warning' },
          )

          return
        }

        if (item['Celular'] && String(item['Celular']).trim().length !== 10) {
          enqueueSnackbar(
            `Por favor, asegúrate de que el número de celular ${item['Celular']} tenga 10 dígitos`,
            { variant: 'warning' },
          )

          return
        }

        if (item['Teléfono'] && String(item['Teléfono']).trim().length > 15) {
          enqueueSnackbar(
            `Por favor, asegúrate de que el número de teléfono ${item['Teléfono']} sea válido`,
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
        const highSchoolName = String(
          item['Institución educativa'] || '',
        ).trim()

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
              return `Especialidad ${item['Especialidad'].toString().trim()}`
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

        if (item['Correo UTA'] || item['Correo']) {
          const birthdate = item['Fecha Nacimiento']
            ? new Date(item['Fecha Nacimiento'])
            : undefined

          let career = careers.find(
            (career: ICareer) =>
              career.name.toLowerCase() ===
              (item['Carrera'] as string).toLowerCase(),
          )?.id as number

          if (item['Carrera'] === 'ING. EN SISTEMAS COMPUTAC.E INFORMATICOS') {
            career = careers.find(
              (career: ICareer) =>
                career.name ===
                'Ingeniería en Sistemas Computacionales e Informáticos',
            )?.id as number
          }

          if (career == null) {
            enqueueSnackbar(
              `Por favor, asegúrate de que la carrera ${item['Carrera']} sea válida, revisa que el nombre de la carrera sea el mismo del nombre registrado en el sistema`,
              { variant: 'error' },
            )

            return
          }

          let cityString: string = String(item['Cantón']).toUpperCase().trim()
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
            outlookEmail: item['Correo UTA']
              ? String(item['Correo UTA']).trim()
              : '',
            personalEmail: String(item['Correo']).trim(),
            phoneNumber: String(item['Celular']).trim(),
            regularPhoneNumber: String(item['Teléfono']).trim(),
            dni: String(item['Cédula']).trim(),
            folio: item['Folio'] ? String(item['Folio']).trim() : undefined,
            gender: String(item['Género']).trim(),
            bachelorDegree: capitalizeSentence(getBachelorDegree()),
            registration: item['Matrícula']
              ? String(item['Matrícula']).trim()
              : undefined,
            birthdate,
            canton: city!.id as number,
            isActive: true,
            career,
            highSchoolName,
          } as StudentModel
        } else if (item['Horas Vinculación'] && item['Horas Prácticas']) {
          return {
            dni: item['Cédula'].toString().trim(),
            vinculationHours: parseInt(item['Horas Vinculación'], 10) || 0,
            internshipHours: parseInt(item['Horas Prácticas'], 10) || 0,
          } as StudentModel
        } else {
          // date format is dd/mm/yyyy
          if (typeof item['Inicio clases'] === 'number') {
            enqueueSnackbar(
              `Por favor, asegúrate de que la fecha de inicio de clases del estudiante con cédula ${item['Cédula']} sea válida`,
              { variant: 'error' },
            )

            return
          }
          const startStudiesDateValueToCheck = item['Inicio clases']

          if (
            startStudiesDateValueToCheck &&
            startStudiesDateValueToCheck.split('/').length !== 3
          ) {
            enqueueSnackbar(
              `Por favor, asegúrate de que la fecha de inicio de clases "${item['Inicio clases']}" del estudiante con cédula ${item['Cédula']} sea válida`,
              { variant: 'error' },
            )

            return
          }

          const startStudiesDate = item['Inicio clases']
            ? new Date(
                (item['Inicio clases'] as string)
                  .trim()
                  .split('/')
                  .reverse()
                  .join('-'),
              )
            : undefined

          // const endStudiesDate = item['Fin clases']
          //   ? new Date(item['Fin clases'].split('/').reverse().join('-'))
          //   : undefined

          const endStudiesDateToCheck = item['Fin clases']
            ? (item['Fin clases'] as string).trim()
            : undefined

          if (
            endStudiesDateToCheck &&
            endStudiesDateToCheck !== 'EN PROCESO' &&
            endStudiesDateToCheck.split('/').length !== 3
          ) {
            enqueueSnackbar(
              `Por favor, asegúrate de que la fecha de fin de clases "${endStudiesDateToCheck}"del estudiante con cédula ${item['Cédula']} sea válida`,
              { variant: 'error' },
            )

            return
          }

          if (endStudiesDateToCheck && !isValidDate(endStudiesDateToCheck)) {
            enqueueSnackbar(
              `Por favor, asegúrate de que la fecha de fin de clases "${endStudiesDateToCheck}" del estudiante con cédula ${item['Cédula']} sea válida`,
              { variant: 'error' },
            )

            return
          }

          return {
            dni: item['Cédula'].toString(),
            startStudiesDate,
            endStudiesDate: endStudiesDateToCheck
              ? new Date(
                  (endStudiesDateToCheck as string)
                    .trim()
                    .split('/')
                    .reverse()
                    .join('-'),
                )
              : undefined,
            approvedCredits: parseInt(item['Créditos Carrera'], 10) || 0,
            bachelorDegree: capitalizeSentence(getBachelorDegree()),
            highSchoolName,
          } as StudentModel
        }
      } catch (error) {
        enqueueSnackbar(
          `Error en los datos ${
            item['Cédula']
              ? `del estudiante con cédula ${item['Cédula']}`
              : `fila ${index}${1}`
          }`,
          { variant: 'error' },
        )
      }
    })
    .filter((item) => item !== undefined)

const isValidDate = (date: string): boolean => {
  // date format is dd/mm/yyyy
  if (date === 'EN PROCESO') {
    return true
  }
  if (typeof date === 'number') {
    return false
  }

  if (date && date.split('/').length !== 3) {
    return false
  }

  return true
}
