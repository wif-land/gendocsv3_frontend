export interface IStudent {
  id: string
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthDate: Date
  canton: string
  personalEmail: string
  institutionalEmail: string
  regularPhoneNumber: string
  cellphone: string
  folio: string
  isActive: boolean
}
export interface ICreateStudent {
  dni: string
  firstName: string
  secondName: string
  firstLastName: string
  secondLastName: string
  gender: string
  birthDate: Date
  canton: string
  personalEmail: string
  institutionalEmail: string
  regularPhoneNumber: string
  cellphone: string
  folio: string
  isActive: boolean
}
