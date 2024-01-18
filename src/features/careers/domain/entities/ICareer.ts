export interface ICareer {
  id?: number
  createdAt?: Date
  updatedAt?: Date
  name: string
  credits: number
  menDegree: string
  womenDegree: string
  isActive: boolean
  internshipHours: number
  vinculationHours: number
  coordinator: ICareerCoordinator | number | string
}

export interface ICareerCoordinator {
  id: number
  firstLastName: string
  firstName: string
}
