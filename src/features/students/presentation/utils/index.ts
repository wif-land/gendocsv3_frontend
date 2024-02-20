import { enqueueSnackbar } from 'notistack'
import { ICareer } from '../../../careers/domain/entities/ICareer'
import { StudentModel } from '../../data/models/StudentModel'
import { IStudent } from '../../domain/entities/IStudent'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const transformData = (data: any[], careers: ICareer[]): IStudent[] =>
  data.map((item: any) => {
    if (
      !item['Primer Nombre'] ||
      !item['Fecha de nacimiento'] ||
      !item['Carrera'] ||
      !item['Cédula'] ||
      !item['Género'] ||
      !item['Número celular'] ||
      !item['Cantón'] ||
      !item['Créditos Aprovados'] ||
      !item['Folio'] ||
      !item['registration'] ||
      !item['outlookEmail'] ||
      !item['personalEmail'] ||
      !item['Primer Apellido'] ||
      !item['Segundo Apellido'] ||
      !item['Segundo Nombre'] ||
      !item['Teléfono convencional']
    ) {
      enqueueSnackbar(
        'Por favor, asegúrate de que todos los campos estén completos',
        { variant: 'error' },
      )
      return StudentModel.fromJson({})
    }

    const excelDate = new Date(
      // eslint-disable-next-line no-magic-numbers
      Math.round((item['Fecha de nacimiento'] - 25569) * 86400 * 1000),
    )
    const formattedDate = excelDate.toISOString().split('T')[0]

    return {
      firstName: item['Primer Nombre'],
      secondName: item['Segundo Nombre'],
      firstLastName: item['Primer Apellido'],
      secondLastName: item['Segundo Apellido'],
      outlookEmail: item['outlookEmail'],
      personalEmail: item['personalEmail'],
      phoneNumber: item['Número celular'],
      regularPhoneNumber: item['Teléfono convencional'],
      dni: item['Cédula'].toString(),
      registration: item['registration'].toString(),
      folio: item['Folio'].toString(),
      gender: item['Género'],
      birthdate: formattedDate,
      canton: item['Cantón'],
      approvedCredits: parseInt(item['Créditos Aprovados'], 10),
      isActive: true,
      career: careers.find((career: ICareer) => career.name === item['Carrera'])
        ?.id as number,
    } as IStudent
  })
