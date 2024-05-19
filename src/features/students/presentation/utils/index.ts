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
    if (
      !item['Cédula'] ||
      !item['Género'] ||
      !item['Fecha de nacimiento'] ||
      !item['Cantón'] ||
      !item['Carrera'] ||
      !item['Teléfono convencional'] ||
      !item['Número celular'] ||
      !item['personalEmail'] ||
      !item['outlookEmail'] ||
      !item['registration'] ||
      !item['Folio'] ||
      !item['Titulo de Bachillerato']
    ) {
      enqueueSnackbar(
        'Por favor, asegúrate de que todos los campos estén completos',
        { variant: 'warning' },
      )

      return StudentModel.fromJson({})
    }

    const excelDate = new Date(
      // eslint-disable-next-line no-magic-numbers
      Math.round((item['Fecha de nacimiento'] - 25569) * 86400 * 1000),
    )
    const formattedDate = excelDate.toISOString().split('T')[0]

    const excelDate2 = new Date(
      // eslint-disable-next-line no-magic-numbers
      Math.round((item['Fecha de inicio de estudios'] - 25569) * 86400 * 1000),
    )

    const formattedDate2 = excelDate2.toISOString().split('T')[0]

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
      bachelorDegree: item['Titulo de Bachillerato'],
      startStudiesDate: formattedDate2,
      vinculationHours: parseInt(item['Horas de vinculación'], 10),
      internshipHours: parseInt(item['Horas de pasantías'], 10),
      birthdate: formattedDate,
      canton: canton.find((city: ICity) => city.name === item['Cantón'])
        ?.id as number,
      approvedCredits: parseInt(item['Créditos Aprovados'], 10),
      isActive: true,
      career: careers.find((career: ICareer) => career.name === item['Carrera'])
        ?.id as number,
    } as StudentModel
  })
