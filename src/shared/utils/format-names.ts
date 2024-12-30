import { IUser } from '../../features/users/domain/entities/IUser'
import { IFunctionary } from '../../features/functionaries/domain/entities/IFunctionary'
import { IStudent } from '@/features/students/domain/entities/IStudent'

export const fUserNames = (user: IUser) =>
  `${user.firstName || ''} ${user.secondName || ''} ${
    user.firstLastName || ''
  } ${user.secondLastName || ''}`

export const fUserNamesShort = (user: IUser) =>
  `${user.firstName || ''} ${user.firstLastName || ''}`

export const fUserNamesWithSecondName = (user: IUser) =>
  `${user.firstName || ''} ${user.secondName || ''} ${user.firstLastName || ''}`

export const fPersonNames = (person?: IFunctionary | IStudent) => {
  if (!person) return

  return `${person.firstName || ''} ${person.secondName || ''} ${
    person.firstLastName || ''
  } ${person.secondLastName || ''}`
}

export const fFunctionaryNamesShort = (functionary: IFunctionary) =>
  `${functionary.firstName || ''} ${functionary.firstLastName || ''}`

export const fFunctionaryNamesWithSecondName = (functionary: IFunctionary) =>
  `${functionary.firstName || ''} ${functionary.secondName || ''} ${
    functionary.firstLastName || ''
  }`

export const fFunctionaryDegreeNames = (functionary: IFunctionary) =>
  ` ${functionary.firstName || ''} ${functionary.secondName || ''} ${
    functionary.firstLastName || ''
  } ${functionary.secondLastName || ''}`
