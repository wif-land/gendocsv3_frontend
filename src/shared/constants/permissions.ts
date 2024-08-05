import { UserRole } from '../../features/users/domain/entities/IUser'
import { DegreeCertificateModel } from '../../features/degree-certificates/data/models/DegreeCertificateModel'

const MUTATE_FIELDS_WRITTER = {
  [DegreeCertificateModel.name]: [
    'roomId',
    'duration',
    'link',
    'certificateStatusId',
    'userId',
    'presentationDate',
  ],
}

export const SPANISH_FIELDS = {
  [DegreeCertificateModel.name]: {
    topic: 'Tema',
    presentationDate: 'Fecha de presentación',
    studentId: 'Estudiante',
    certificateTypeId: 'Tipo de certificado',
    certificateStatusId: 'Estado de certificado',
    degreeModalityId: 'Modalidad de grado',
    roomId: 'Aula',
    duration: 'Duración',
    link: 'Enlace',
    isClosed: 'Acta cerrada?',
    userId: 'Usuario',
    changeUniversityResolution: 'Resolución de cambio de universidad',
    changeUniversityName: 'Nombre universidad anterior',
  },
}

export const PERMISSIONS: Permission = {
  [UserRole.ADMIN]: {
    [DegreeCertificateModel.name]: {
      UPDATE: ['*'],
    },
  },
  [UserRole.WRITER]: {
    [DegreeCertificateModel.name]: {
      UPDATE: MUTATE_FIELDS_WRITTER[DegreeCertificateModel.name],
    },
  },
  [UserRole.READER]: {
    [DegreeCertificateModel.name]: {
      UPDATE: [],
    },
  },
  [UserRole.TEMP_ADMIN]: {
    [DegreeCertificateModel.name]: {
      UPDATE: ['*'],
    },
  },
  [UserRole.API]: {
    [DegreeCertificateModel.name]: {
      UPDATE: ['*'],
    },
  },
}

export type Permission = {
  [role in UserRole]: {
    [modelName: string]: {
      UPDATE: string[]
    }
  }
}
