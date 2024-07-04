import { enqueueSnackbar } from 'notistack'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { StudentModel } from '../../data/models/StudentModel'
import { IStudent } from '../../domain/entities/IStudent'
import { ICanton } from '../../../../core/providers/domain/entities/ILocationProvider'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformData = (
  data: any[],
  careers: ICareer[],
  canton: ICanton[],
): IStudent[] =>
  data
    .map((item: any) => {
      if (!item['Cédula']) {
        console.log(item)
        // enqueueSnackbar(
        //   'Por favor, asegúrate de que el estudiante tenga una cédula válida',
        //   { variant: 'warning' },
        // )

        return
      }

      if (String(item['Cédula']).length < 10) {
        enqueueSnackbar(
          'Por favor, asegúrate de que la cédula tenga al menos 10 dígitos',
          { variant: 'warning' },
        )

        return
      }

      const safeToString = (value: any) => {
        if (value === null || value === undefined) return ''
        return value.toString()
      }

      let firstName = ''
      let secondName = ''
      let firstLastName = ''
      let secondLastName = ''

      console.log(item)
      if (item['Nombres']) {
        const names = safeToString(item['Nombres']).split(' ')
        firstName = names[0]
        secondName = names[1] || ''
      } else {
        firstName = safeToString(item['Primer Nombre'])
        secondName = safeToString(item['Segundo Nombre'])
      }

      if (item['Apellidos']) {
        const lastNames = safeToString(item['Apellidos']).split(' ')
        firstLastName = lastNames[0]
        secondLastName = lastNames[1] || ''
      } else {
        firstLastName = safeToString(item['Primer Apellido'])
        secondLastName = safeToString(item['Segundo Apellido'])
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
        return {
          firstName,
          secondName,
          firstLastName,
          secondLastName,
          outlookEmail: item['Correo UTA'],
          personalEmail: item['Correo'],
          phoneNumber: item['Celular'],
          regularPhoneNumber: item['Teléfono'],
          dni: item['Cédula'].toString(),
          folio: item['Folio'],
          gender: item['Género'],
          bachelorDegree: item['Título'] || '',
          registration: item['Matrícula'],
          birthdate: item['Fecha Nacimiento'],
          canton: canton.find(
            (city: ICanton) => city.name.toUpperCase() === item['Cantón'],
          )?.id as number,
          isActive: true,
          career,
        } as StudentModel
      } else if (item['Horas Vinculación'] && item['Horas Prácticas']) {
        return {
          firstName,
          secondName,
          firstLastName,
          secondLastName,
          dni: item['Cédula'].toString(),
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
          bachelorDegree: item['Título'] || '',
        } as StudentModel
      }
    })
    .filter((item) => item !== undefined)
