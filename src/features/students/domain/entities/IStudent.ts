import { ICreateStudent } from './ICreateStudent'

export interface IStudent extends ICreateStudent {
  id: number
  updatedAt: string
  createdAt: string
  label?: string
}
