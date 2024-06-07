import { enqueueSnackbar } from 'notistack'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { StudentModel } from '../../data/models/StudentModel'
import { IStudent } from '../../domain/entities/IStudent'
import { ICity } from '../../../../core/providers/domain/entities/ILocationProvider'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformData = (
  data: any[],
  careers: ICareer[],
  canton: ICity[],
): IStudent[] =>
  data.map((item: any) => {
    if (!item['Cédula']) {
      enqueueSnackbar(
        'Por favor, asegúrate de que todos los campos estén completos',
        { variant: 'warning' },
      )

      return StudentModel.fromJson({})
    }

    const safeToString = (value: any) => {
      if (value === null || value === undefined) return ''
      return value.toString()
    }

    let firstName = ''
    let secondName = ''
    let firstLastName = ''
    let secondLastName = ''

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
      return {
        firstName,
        secondName,
        firstLastName,
        secondLastName,
        outlookEmail: item['Correo UTA'],
        personalEmail: item['Correo'],
        phoneNumber: item['Celular'],
        regularPhoneNumber: item['Teléfono'],
        startStudiesDate: item['Fecha Matícula'] || new Date(),
        dni: item['Cédula'].toString(),
        folio: item['Folio'],
        gender: item['Género'],
        bachelorDegree: item['Título'] || '',
        registration: item['Matrícula'],
        birthdate: item['Fecha Nacimiento'],
        canton: canton.find(
          (city: ICity) => city.name.toUpperCase() === item['Cantón'],
        )?.id as number,
        isActive: true,
        career: careers.find(
          (career: ICareer) => career.name === item['Carrera'],
        )?.id as number,
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
        approvedCredits: parseInt(item['Créditos Aprobados'], 10) || 0,
        bachelorDegree: item['Título'] || '',
      } as StudentModel
    }
  })
